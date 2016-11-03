module.exports = {
	PORT: process.env.PORT || 3000,
	DB: process.env.DB || 'mongodb://localhost/matchmetrics',
	JWT: process.env.JWT || 'matchmetrics'
};