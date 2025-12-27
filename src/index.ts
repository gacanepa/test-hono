import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => {
  return c.text('Hello Hono!');
});

app.get('/entry/:id', (c) => {
  const id = c.req.param('id');
  return c.json({
    id,
    message: 'Hello Hono!',
    timestamp: new Date().toISOString(),
    context: c,
    headers: c.req.header(),
  });
});

app.get('/exchange', async (c) => {
  try {
    const response = await fetch('https://dolarapi.com/v1/cotizaciones');
    if (!response.ok) {
      return c.json({ error: 'Failed to fetch exchange' }, 500);
    }
    const data = await response.json();
    return c.json(data);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ error: 'Failed to fetch exchange', details: errorMessage }, 500);
  }
});

export default app;
