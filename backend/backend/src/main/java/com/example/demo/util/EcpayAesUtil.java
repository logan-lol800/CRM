package com.example.demo.util;

import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;

public class EcpayAesUtil {

    /**
     * AES 加密
     * @param data 要加密的字串
     * @param hashKey ECPay HashKey
     * @param hashIv ECPay HashIV
     * @return 加密後的 Base64 字串
     */
    public static String encrypt(String data, String hashKey, String hashIv) {
        try {
            String urlEncodedData = URLEncoder.encode(data, StandardCharsets.UTF_8.toString());

            Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
            SecretKeySpec keySpec = new SecretKeySpec(hashKey.getBytes(StandardCharsets.UTF_8), "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(hashIv.getBytes(StandardCharsets.UTF_8), 0, 16);

            cipher.init(Cipher.ENCRYPT_MODE, keySpec, ivSpec);
            byte[] encryptedBytes = cipher.doFinal(urlEncodedData.getBytes(StandardCharsets.UTF_8));

            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("AES encryption failed", e);
        }
    }

    /**
     * AES 解密
     * @param encryptedData 加密的 Base64 字串
     * @param hashKey ECPay HashKey
     * @param hashIv ECPay HashIV
     * @return 解密後的原始字串
     */
    public static String decrypt(String encryptedData, String hashKey, String hashIv) {
        try {
            byte[] decodedBytes = Base64.getDecoder().decode(encryptedData);

            Cipher cipher = Cipher.getInstance("AES/CBC/NoPadding"); // 注意，PHP 的 openssl_decrypt(..., OPENSSL_RAW_DATA) 對應 Java 的 NoPadding
            SecretKeySpec keySpec = new SecretKeySpec(hashKey.getBytes(StandardCharsets.UTF_8), "AES");
            IvParameterSpec ivSpec = new IvParameterSpec(hashIv.getBytes(StandardCharsets.UTF_8), 0, 16);

            cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
            byte[] decryptedBytes = cipher.doFinal(decodedBytes);

            // 移除 PKCS5Padding
            int padding = decryptedBytes[decryptedBytes.length - 1];
            int length = decryptedBytes.length - padding;
            byte[] unpaddedBytes = new byte[length];
            System.arraycopy(decryptedBytes, 0, unpaddedBytes, 0, length);

            return URLDecoder.decode(new String(unpaddedBytes, StandardCharsets.UTF_8), StandardCharsets.UTF_8.toString());
        } catch (Exception e) {
            // PHP 的 OPENSSL_RAW_DATA 解密後，若有 padding 問題，有時需要手動處理
            // 如果上述方法失敗，可以嘗試使用 PKCS5Padding
            try {
                byte[] decodedBytes = Base64.getDecoder().decode(encryptedData);
                Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
                SecretKeySpec keySpec = new SecretKeySpec(hashKey.getBytes(StandardCharsets.UTF_8), "AES");
                IvParameterSpec ivSpec = new IvParameterSpec(hashIv.getBytes(StandardCharsets.UTF_8), 0, 16);

                cipher.init(Cipher.DECRYPT_MODE, keySpec, ivSpec);
                byte[] decryptedBytes = cipher.doFinal(decodedBytes);

                return URLDecoder.decode(new String(decryptedBytes, StandardCharsets.UTF_8), StandardCharsets.UTF_8.toString());

            } catch (Exception innerE) {
                throw new RuntimeException("AES decryption failed", innerE);
            }
        }
    }
}