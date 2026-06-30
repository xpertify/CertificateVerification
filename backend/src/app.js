const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth.routes');
const institutionRoutes = require('./routes/institution.routes');
const certificateRoutes = require('./routes/certificate.routes');
const { errorHandler } = require('./middleware/errorHandler.middleware');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/institutions', institutionRoutes);
app.use('/api/certificates', certificateRoutes);

app.use(errorHandler);

module.exports = app;
