//there's already a user db provided by Meteor, including all the info we need
Story = new Mongo.Collection("story"); 
Chapters = new Mongo.Collection("chapters"); 
Likes = new Mongo.Collection("likes");
Follows = new Mongo.Collection("follows");
Notifications = new Mongo.Collection("notificiations");
Comments = new Mongo.Collection("comments");
//TODO: Infinite load (scaling)
//TODO: Login Buttons on mobile



var Schemas = {};
Schemas.Story = new SimpleSchema({
  title: {
    type: String,
    label: "Title",
    max: 200
  },
  genre: {
    type: String,
    label: "Genre",
    max: 50
  },
  rating: {
    type: String,
    allowedValues: ['G', 'T', 'R', 'E']
  },
  chapters: {
    type: Number,
    autoValue: function(){if(this.isInsert) return 0;},
    label: "Number of chapters in this story"
  },
  description: {
    type: String,
    label: "Short summary of the story",
    max: 500
  },
  status: {
    type: String,
    allowedValues: ['Complete', 'Work-In-Progress'],
    autoValue: function(){if(this.isInsert) return 'Work-In-Progress';}
  },
  uploadDate: {
    type: Date,
    autoValue: function(){if(this.isInsert) return new Date();}
  },
  wordCount: {
    type: Number,
    autoValue: function(){if(this.isInsert) return 0;}
  },
  updateDate: {
    type: Date,
    autoValue: function(){if(this.isInsert) return new Date();}
  },
  author: {
    type: String,
    autoValue: function(){if(this.isInsert) return Meteor.userId();}
  },
  likes: {
    type: Number,
    autoValue: function(){if(this.isInsert) return 0;}
  },
  displayChapterNumbers: {
    type: Boolean,
    autoValue: function(){if(this.isInsert) return true;}
  },
  follows: {
    type: Number,
    autoValue: function(){if(this.isInsert) return 0;}
  },
  comments: {
    type: Number,
    autoValue: function(){if(this.isInsert) return 0;}
  }
});

Schemas.Chapters = new SimpleSchema({
  number: {
    type: Number,
    label: "Order of chapter in story",
    min: 1
  },
  story: {
    type: String,
    label: "ID of the story this belongs to"
  },
  note: {
    type: String,
    label: "Note on this chapter",
    optional: true
  },
  content: {
    type: String,
    label: "Content of this chapter",
  },
  wordCount: {
    type: Number,
    label: "Number of words in this chapter"
  },
  date: {
    type: Date,
    label: "Date this chapter was last updated",
    autoValue: function(){
      if(this.isInsert || this.isUpdate) return new Date();
    }
  }
});

Schemas.Likes = new SimpleSchema({
  liker: {
    type: String,
    label: "ID of person who liked this story",
    autoValue: function(){
      if(this.isInsert) return Meteor.userId();
    }
  },
  story: {
    type: String,
    label: "ID of story liked"
  },
  date: {
    type: Date,
    label: "Date this was last liked",
    autoValue: function(){
      if(this.isInsert) return new Date();
    }
  }
});

Schemas.Follows = new SimpleSchema({
  follower: {
    type: String,
    label: "ID of person who followed this story",
    autoValue: function(){
      if(this.isInsert) return Meteor.userId();
    }
  },
  story: {
    type: String,
    label: "ID of story followed"
  },
  date: {
    type: Date,
    label: "Date this was last followed",
    autoValue: function(){
      if(this.isInsert) return new Date();
    }
  }
});

Schemas.Notifications = new SimpleSchema({
  user: {
    type: String,
    label: "User this notification is for"
  },
  id: {
    type: String,
    label: "ID of like, follow, comment or story updated"
  },
  type: {
    type: String,
    label: "Type of notification",
    allowedValues: ['L', 'F', 'C', 'U']
  },
  date: {
    type: Date,
    label: "Date this notification happened",
    autoValue: function(){if(this.isInsert) return new Date();}
  }
});

Schemas.Comments = new SimpleSchema({
  commenter: {
    type: String,
    label: "ID of person who commented",
    autoValue: function(){if(this.isInsert) return Meteor.userId();}
  },
  story: {
    type: String,
    label: "ID of story this comment is on"
  },
  chapter: {
    type: Number,
    label: "Number of chapter this comment is on"
  },
  comment: {
    type: String,
    label: "The actual comment",
    max:500
  },
  date: {
    type: Date,
    label: "The time at which this comment happened",
    autoValue: function(){if(this.isInsert) return new Date();}
  }
});

Story.attachSchema(Schemas.Story);
Chapters.attachSchema(Schemas.Chapters);
Likes.attachSchema(Schemas.Likes);
Follows.attachSchema(Schemas.Follows);
Notifications.attachSchema(Schemas.Notifications);
Comments.attachSchema(Schemas.Comments);
