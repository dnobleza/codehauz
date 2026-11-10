function health(req, res) {
  res.json({
    status: 'Ok',
    service: 'core-service',
  });
}

module.exports = health;
