import Waterline from 'waterline'

var Book = Waterline.Collection.extend({
  identity: 'book',
  connection: 'default',
  attributes: {
    id:{
      type:'string',
    //   required:true
    },
    bookname: {
        type: 'string',
        required: true,
    },
    by: {
        type: 'string',
        required: true,
    },
    publisher: {
        type: 'string',
        required: true,
    },
    isbn: {
        type: 'string',
        required: true,
    },
    language: {
        type: 'string',
        required: true,
    },
    year: {
        type: 'string',
        required: true,
    },
    page: {
        type: 'string',
        required: true,
    },
    format: {
        type: 'string',
        required: true,
    },
    images:{
        type: 'string',
    },
    description:{
        type: 'string',
    }
  }
});

module.exports= Book;
