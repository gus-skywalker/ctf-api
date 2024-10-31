const User = require('../models/User');
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    console.log(req.body);
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password });
        await user.save();

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        console.log(token);
        console.log(user)

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ msg: 'Invalid Credentials' });

        const payload = { user: { id: user.id } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.getSessionInstance = async (req, res) => {
  try {
    const session = await Session.findOne({ userId: req.user.id });

    if (!session) {
      return res.status(404).json({ msg: 'Session not found' });
    }

    res.json({ instanceIP: session.instanceIP, taskArn: session.taskArn });
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).send('Server error');
  }
};
