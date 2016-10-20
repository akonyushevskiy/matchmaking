module.exports = {
	PORT: process.env.PORT || 8080,
	DB: process.env.DB || 'mongodb://localhost/matchmaking',
	JWT: process.env.JWT || 'matchmaking'
};