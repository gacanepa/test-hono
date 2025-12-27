import { Hono } from 'hono';
import { EXCHANGE_BASE_URL, WEATHER_BASE_URL } from './common/constants/urls';

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
    const response = await fetch(`${EXCHANGE_BASE_URL}/cotizaciones`);
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

app.get('/weather/:latitude/:longitude', async (c) => {
  const latitude = c.req.param('latitude');
  const longitude = c.req.param('longitude');
  const response = await fetch(`${WEATHER_BASE_URL}/points/${latitude},${longitude}`);
  if (!response.ok) {
    return c.json({ error: 'Failed to fetch weather' }, 500);
  }
  const data = await response.json();
  return c.json({ latitude, longitude, data });
});

export default app;
