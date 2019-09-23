var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Article = require("./articles");


console.log('Running Mongoose Version: ', mongoose.version);
 
const NoteSchema = mongoose.Schema({
    title: {
        type: String,
    },
    text: {
        type: String,
    },
    article: [{ type: Schema.Types.ObjectId, ref: 'Article' }],
    date: {
        type: Date
    }
});


console.log('NoteSchema created!');

var Note = mongoose.model('Note', NoteSchema);

module.exports = Note;