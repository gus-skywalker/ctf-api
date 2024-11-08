const User = require('../models/User');
const Session = require('../models/Session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    const { username, email, password, avatar } = req.body;

    console.log(req.body);
    try {
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: 'User already exists' });

        user = new User({ username, email, password, avatar });
        await user.save();

        res.json({
            msg: 'Usuário criado com sucesso',
            user: {
                id: user.id,
                username: user.username,
                avatar: user.avatar,
                email: user.email,
            },
        });
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

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
          token,
          username: user.username,
          avatar: user.avatar,
      });
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
};

exports.update = async (req, res) => {
  const userId = req.user.id;
  const { username, password, currentPassword, avatar } = req.body;

  try {
      const updates = {};

      const user = await User.findById(userId);

      if (username) {

          const existingUser = await User.findOne({ username });
          if (existingUser && existingUser._id.toString() !== userId) {
              return res.status(400).json({ msg: 'Nome de usuário já está em uso' });
          }
          updates.username = username;
      }

      if (password) {

          if (!currentPassword) {
              return res.status(400).json({ msg: 'Senha atual é necessária para alterar a senha' });
          }

          const isMatch = await bcrypt.compare(currentPassword, user.password);
          if (!isMatch) {
              return res.status(400).json({ msg: 'Senha atual incorreta' });
          }

          const salt = await bcrypt.genSalt(10);
          const hashedPassword = await bcrypt.hash(password, salt);
          updates.password = hashedPassword;
      }

      if (avatar) {
          updates.avatar = avatar;
      }

      if (Object.keys(updates).length === 0) {
          return res.status(400).json({ msg: 'Nenhum campo para atualizar' });
      }

      const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });

      res.json({
          msg: 'Usuário atualizado com sucesso',
          user: {
              id: updatedUser.id,
              username: updatedUser.username,
              avatar: updatedUser.avatar,
              email: updatedUser.email,
          },
      });
  } catch (error) {
      console.error('Erro ao atualizar o usuário:', error.message);
      res.status(500).send('Erro no servidor');
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
