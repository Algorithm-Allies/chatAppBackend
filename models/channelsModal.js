const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema(
  {
    channelName: {
      type: String,
      required: [true, "Please add a channel name"],
      unique: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    members: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Message'
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Channel = mongoose.model('Channel', channelSchema)

module.exports = Channel;
