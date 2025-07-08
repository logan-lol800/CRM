import { rest } from 'msw';

export const loginHandlers = [
  rest.post('/api/customer/auth/login', async (req, res, ctx) => {
    const { email, password } = await req.json();

    if (email === 'kevin_lin88' && password === 'MyStr0ngP@sswd#1') {
      return res(
        ctx.status(200),
        ctx.json({
          token: 'fake-jwt-token',
          user: { id: 1, name: '測試用戶', email, role: 'admin' },
        })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ message: 'Invalid credentials' })
    );
  }),

  rest.get('/api/auth/profile', (req, res, ctx) => {
    const authHeader = req.headers.get('Authorization');
    if (authHeader === 'Bearer fake-jwt-token') {
      return res(
        ctx.status(200),
        ctx.json({ id: 1, name: '測試用戶', email: 'test@example.com' })
      );
    }

    return res(
      ctx.status(401),
      ctx.json({ message: 'Unauthorized' })
    );
  }),
];
