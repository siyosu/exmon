const { Router } = require('express');

const router = Router();

router.get('/', (req, res) => {
	res.send({ success: true, message: 'Hello world!' });
});

module.exports = router;
