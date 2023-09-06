const mongoose = require('mongoose');
const schema = mongoose.Schema;

const projectSchema = new schema({
    task:{
        type: String,
        required: true
    },
    status:{
        type: Boolean,
        default: false
    }
})

const model = mongoose.model("model", projectSchema);
module.exports = model;