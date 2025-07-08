-- Add missing foreign key constraint for sales_order_details to products
ALTER TABLE `sales_order_details`
  ADD CONSTRAINT `FK_salesdetail_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`);

-- Add foreign key constraints for user references in products table
ALTER TABLE `products`
  ADD CONSTRAINT `FK_product_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FK_product_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `user` (`user_id`);

-- Add foreign key constraints for user references in product_categories table
ALTER TABLE `product_categories`
  ADD CONSTRAINT `FK_productcategory_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FK_productcategory_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `user` (`user_id`);

-- Add foreign key constraints for user references in suppliers table
ALTER TABLE `suppliers`
  ADD CONSTRAINT `FK_supplier_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FK_supplier_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `user` (`user_id`);

-- Add foreign key constraints for user references in units table
ALTER TABLE `units`
  ADD CONSTRAINT `FK_unit_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`),
  ADD CONSTRAINT `FK_unit_updated_by` FOREIGN KEY (`updated_by`) REFERENCES `user` (`user_id`);

-- Add foreign key constraints for user references in warehouses table
ALTER TABLE `warehouses`
  ADD CONSTRAINT `FK_warehouse_created_by` FOREIGN KEY (`created_by`) REFERENCES `user` (`user_id`);
