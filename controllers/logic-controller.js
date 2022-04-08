const { Logic } = require('../models/Logic');
const User = require('../models/User');

const logicController = {
    getAllThoughts(req, res) {
        Logic.find({})
            .then(dbLogicData => res.json(dbLogicData))
            .catch(err => {
            console.log(err);
             res.status(400).json(err);
            });
    },
    getLogicById({ params }, res) {
        Logic.findOne({ _id: params.logicId })
            .then(dbLogicData => {
                if (!dbLogicData) {
                 res.status(404).json({ message: 'Nothing was found' });
                return;
                }
                res.json(dbLogicData);
            })
            .catch(err => {
                console.log(err);
                res.status(400).json(err);
            });
    },
    addLogic({ params, body }, res) {
        console.log(body);
        Logic.create(body)
            .then(({ _id }) => {
                return User.findOneAndUpdate(
                 { _id: params.userId },
                 { $push: { logic: _id } },
                { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                 res.status(404).json({ message: 'Nothing found' });
                return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    updateLogic({ params, body }, res) {
        Logic.findOneAndUpdate({ _id: params.logicId }, body, { new: true, runValidators: true })
            .then(dbLogicData => {
                if (!dbLogicData) {
                 res.status(404).json({ message: 'Nothing was found' });
                return;
                }
                res.json(dbLogicData);
            })
            .catch(err => res.status(400).json(err));
    },
    removeLogic({ params }, res) {
        Logic.findOneAndDelete({ _id: params.thoughtId })
            .then(deletedLogic => {
                if (!deletedLogic) {
                    return res.status(404).json({ message: 'Nothing found' });
                }
                return User.findOneAndUpdate(
                { _id: params.userId },
                { $pull: { logic: params.thoughtId } },
                { new: true }
                );
            })
            .then(dbUserData => {
                if (!dbUserData) {
                res.status(404).json({ message: 'Nothing found' });
                return;
                }
                res.json(dbUserData);
            })
            .catch(err => res.json(err));
    },
    addReaction({ params, body }, res) {
        Logic.findOneAndUpdate(
        { _id: params.thoughtId },
        { $addToSet: { reactions: body } },
        { new: true, runValidators: true }
        )
            .then(dbLogicData => {
                if (!dbLogicData) {
                 return res.status(404).json({ message: 'Nothing found' });
                }
                res.json(dbLogicData);
            })
            .catch(err => res.json(err));
    },
    removeReaction({ params }, res) {
        console.log(params.thoughtId, params.reactionId);
        Logic.findOneAndUpdate(
            { _id: params.thoughtId },
            { $pull: { reactions: { reactionId: params.reactionId } } },
            { runValidators: true, new: true }
        )
            .then(dbUserData => res.json(dbUserData))
            .catch(err => res.json(err));
    }
};

module.exports = thoughtController;