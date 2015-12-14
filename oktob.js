//there's already a user db provided by Meteor, including all the info we need
Story = new Mongo.Collection("story"); //also has likes in an array for each story
Chapters = new Mongo.Collection("chapters"); //also has comments in an array for each chapter
Likes = new Mongo.Collection("likes");
//start with prototype with only stories, chapters and users then add functionality as we go

//TODO: Loading, Publishing(should we leave it at autopublish? hmm)
//TODO: Move all errors to iron-router
//TODO: Infinite load instead of getting all results at once
//TODO: Add tip to pages with rich text, or force refresh
//WHEN COMMENTS ARE ADDED TO CHAPTERS, MAKE SURE TO REMOVE THEM WITH DELETE

throwError = function(error, reason, details) {  
  var meteorError = new Meteor.Error(error, reason, details);

  if (Meteor.isClient) {
    // this error is never used
    // on the client, the return value of a stub is ignored
    return meteorError;
  } else if (Meteor.isServer) {
    throw meteorError;
  }
};

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

Story.attachSchema(Schemas.Story);
Chapters.attachSchema(Schemas.Chapters);
Likes.attachSchema(Schemas.Likes);


Router.route('/', function () { //TODO If something special for home, render here
  this.render('homeList');
});

Router.route('/profile/:_id', function(){
  var ID = this.params._id;
  Session.set('profileID', ID);
  var pr = Meteor.users.findOne(ID);
  if(pr){
  if(pr.profile) { if(pr.profile.completed) this.render('showProfile');} 
  else if(ID === Meteor.userId() && !pr.profile) this.render('noProfile');
}
else this.render('notFound');
  
});

Router.route('/edit-profile', function(){
  this.render('editProfile');
});

Router.route('/new-story', function(){
  this.render('submitStory');
});

Router.route('/story/:_id', function(){
  var ID = this.params._id;
  if(!Story.findOne(ID)){this.render('notFound');}
  else {Session.set('thisStory', ID);
  this.render('showStory');} 
});

Router.route('/story/:_id/new-chapter', function(){
  var ID = this.params._id;
  Session.set('storyId', ID);
  var st = Story.findOne({_id: ID, author: Meteor.userId()});
  if(st) {this.render('addChapter');}//don't render if ID doesn't exist, 404
  else this.render('noPermission');
});

Router.route('/story/:_id/edit', function(){
  var ID = this.params._id;
  Session.set('storyId', ID);
  var st = Story.findOne({_id: ID, author: Meteor.userId()});
  if(st) this.render('editStory');
  else this.render('noPermission');
});

Router.route('/story/:_id/:chapternumber/edit', function(){
  var ID = this.params._id;
  var num = this.params.chapternumber;
  Session.set('storyId', ID);
  Session.set('chNum', num);
  var st = Story.findOne({_id: ID, author: Meteor.userId()});
  if(st) this.render('editChapter');
  else this.render('noPermission');
});

//more talk here 
//write again to get it to refresh, BABY

if (Meteor.isClient) {
 // Meteor.subscribe('showUserOnly');
    Meteor.startup(function () {
        WebFontConfig = {
    google: { families: [ 'Open+Sans:400,600:latin', 'Righteous::latin' ] }
  };
  (function() {
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
      '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);
  })();

    sAlert.config({
        effect: '',
        position: 'top',
        timeout: 5000,
        html: false,
        onRouteClose: true,
        stack: true,
        // or you can pass an object:
        // stack: {
        //     spacing: 10 // in px
        //     limit: 3 // when fourth alert appears all previous ones are cleared
        // }
        offset: 0, // in px - will be added to first alert (bottom or top - depends of the position in config)
        beep: false
        // examples:
        // beep: '/beep.mp3'  // or you can pass an object:
        // beep: {
        //     info: '/beep-info.mp3',
        //     error: '/beep-error.mp3',
        //     success: '/beep-success.mp3',
        //     warning: '/beep-warning.mp3'
        // }
    });

});
    Template.topNav.onRendered(function(){
       $(document).foundation();
    });
    Template.topNav.helpers({
      id: function(){
        return Meteor.userId();
      }
    });
  Template.welcome.helpers({
    name: function(){
      return Meteor.user().profile.name;
    },
    username: function(){
      return Meteor.user().username;
    }
  });
 
  Template.homeList.helpers({
    profileWarning: function(){
      if(Meteor.user().profile){if(!Meteor.user().profile.completed) sAlert.warning("<p>Looks like your profile isn't complete!</p><p><a href='/edit-profile'>Go here to get started!</a></p>", {html: true, timeout: 100000, position: 'bottom'});}
      else if(!Meteor.user().profile) sAlert.warning("<p>Looks like your profile isn't complete!</p><p><a href='/edit-profile'>Go here to get started!</a></p>", {html: true, timeout: 100000, position: 'bottom'});
    
    },
    homeStory: function(){
      return Story.find({wordCount: {$ne: 0}}, {sort: {updateDate: -1}, limit:10});
    },
    fromNow: function(date){
      return moment(date).fromNow();
    },
    authorName: function(id){
      var author = Meteor.users.findOne(id);
       return author.username;
    }

  });
  Template.showStory.onRendered(function () {
  this.myRevealInstance = new Foundation.Reveal($('#deleteConfirmation'));
  
});

Template.showStory.onDestroyed(function () {
  let reveal = this.myRevealInstance;
 
  if (reveal) {
    reveal.destroy();
  }
});
  Template.showStory.helpers({
    hasChapters: function(){
      var id = Session.get('thisStory');
      var num = Story.findOne(id).chapters;
      if(num==0) return false;
      else return true;
    },
    likes: function(){
      var id = Session.get('thisStory');
      var num = Story.findOne(id).likes;
      return num;
    },
    likeCounter: function(number){
      if(number==0) return " likes so far. Be the first to like this!";
      else if(number==1) return " person likes this.";
      else return " people like this.";
    },
    liked: function(){
      if(!Meteor.user()) return false;
      else {
        var storyId = Session.get('thisStory'); 
        var user = Meteor.userId();
        var like = Likes.findOne({liker: user, story: storyId});
        if(like) return true;
        else return false;
      }
    },
    myProfile: function(){
      var myId = Meteor.userId();
      var storyId = Session.get('thisStory');
      var authorId = Story.findOne(storyId).author;
      if (myId == authorId) return true;
      else return false;
    },
    title: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return st.title;
    },
    hasNote: function(number){
      var id = Session.get('thisStory');
      var chapter = Chapters.findOne({story: id, number: number});
      if(chapter.note) return true;
      else return false;
    },
    authorName: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      var authorid = st.author;
      return Meteor.users.findOne(authorid).username;
    },
    author: function(){
       var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return st.author;
    },
    genre: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return st.genre;
    },
    rating: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return st.rating;
    },
    wordCount: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return st.wordCount;
    },
    chapters: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return st.chapters;
    },
    status: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return st.status;
    },
    uploadDate: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return moment(st.uploadDate).fromNow();
    },
    updateDate: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return moment(st.uploadDate).fromNow();
    },
    _id: function(){
      return Session.get('thisStory');
    },
    description: function(){
      var id = Session.get('thisStory');
      var st = Story.findOne(id);
      return st.description;
    },
    chapter: function(){
      var id = Session.get('thisStory');
      return Chapters.find({story: id}, {sort: {number: 1}});
    },
    notLastChapter: function(number){
      var id = Session.get('thisStory');
      var last = Story.findOne(id).chapters;
      if(last == number) return false;
      else return true;
    }
  });
  Template.showStory.events({
    'click #confirmDelete': function(){
      var id = Session.get('thisStory');

      Meteor.call('deleteStory', id);
      location.reload();
    },
    'click #like-button': function(){
      var story = Session.get('thisStory');
      var user = Meteor.userId();
      if(!user){sAlert.warning("You have to be logged in to like this!");}
      else {Meteor.call('like', story, user);}
    }
  });

  Template.editProfile.onRendered(function(){
     var picker = new Pikaday({ field: document.getElementById('datepicker'), yearRange: [1930,2010] }); //CHANGE END DATE ACCORDINGLY
  });
  Template.editProfile.helpers({
    name: function(){
      if(Meteor.user().profile)
        return Meteor.user().profile.name;
    },
    dob: function(){
      if(Meteor.user().profile)
      return Meteor.user().profile.dob;
    },
    bio: function(){
      if(Meteor.user().profile)
      return Meteor.user().profile.bio;
    }
  });

  Template.editProfile.events({
    'submit form': function(){
      event.preventDefault(); //so page wouldn't refresh
      var realName = event.target.realName.value;
      var dob = event.target.dob.value;
      var bio = event.target.bio.value;
      if(!realName || !dob || !bio) sAlert.error("All fields are required!");
      else{Meteor.call('profileUpdate', realName, dob, bio); 
      var pathToProfile = '/profile/' + Meteor.userId();
      Router.go(pathToProfile);}
    }
  });


  Template.submitStory.events({
    'submit form': function(){
      event.preventDefault();
      var title = event.target.storytitle.value;
      var rating = event.target.rating.value;
      var genre = event.target.genre.value;
      var desc = event.target.desc.value;
      if(rating != 'G' && rating !='E' && rating !='T' && rating !='R') sAlert.error("Invalid rating!");
      else if(!title || !rating || !genre || !desc) sAlert.error("All fields are required!");
      else{Meteor.call('addStory', title, desc, rating, genre); var pathToProfile = '/profile/' + Meteor.userId();
      Router.go(pathToProfile);}
      
      
    },
    'keyup #descriptionBox': function(){
      var x = document.getElementById('descriptionBox').value.length;
      document.getElementById('counter').innerHTML = "Characters left = " + (500-x);

    }
  });

  Template.addChapter.onRendered(function(){
         tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'wordcount paste directionality',
  keep_styles: false,
  paste_word_valid_elements: "b,strong,i,em,h1,h2,p,br"
    });


   
  });

  Template.addChapter.helpers({
    title: function(){
      var id = Session.get('storyId');
      return Story.findOne(id).title;
    },
    storyid: function(){
      return Session.get('storyId');
    }
  });

  Template.addChapter.events({
    'submit form': function(){
      event.preventDefault();
      var note = event.target.note.value;
      var content = event.target.chContent.value;
      var countString = document.getElementById('mceu_31').innerHTML;
      var res = countString.substr(7);
      var wordcount = parseInt(res); //remove parseInt when input isn't string
      var storyid = Session.get('storyId');
      var author = Story.findOne(storyid).author;
      if(author==Meteor.userId()){
      if(!content) sAlert.warning("Chapter must have content!");
      else{Meteor.call('addChapter', storyid, note, content, wordcount);
      var pathToStory = '/story/' + storyid;
      Router.go(pathToStory);}}
      else sAlert.error("You're not permitted to do this!");
      
    }
  });

  Template.showProfile.helpers({
    hasNotPublished: function(){
      var id = Session.get('profileID');
      if(Story.findOne({author: id})) return false;
      else return true;
    },
    hasNotLiked: function(){
      var id = Session.get('profileID');
      if(Likes.findOne({liker: id})) return false;
      else return true;
    },
    likedStory: function(){
      var profileId = Session.get('profileID');
      return Likes.find({liker: profileId}, {sort: {date: -1}});
    },
    username: function(){
      var profileId = Session.get('profileID');
      return Meteor.users.findOne(profileId).username;
    },
    name: function(){
      var profileId = Session.get('profileID');
      return Meteor.users.findOne(profileId).profile.name; //IMPROVE SECURITY HERE
    },
    bio: function(){
      var profileId = Session.get('profileID');
      return Meteor.users.findOne(profileId).profile.bio;
    },
    dob: function(){
      var profileId = Session.get('profileID');
      return Meteor.users.findOne(profileId).profile.dob;
    },
    publishedStory: function(){
      var profileId = Session.get('profileID');
      return Story.find({author: profileId}, {sort: {updateDate: -1}});
    },
    myProfile: function(){
      if(Session.get('profileID') === Meteor.userId()) return true;
      return false;
    },
    fromNow: function(date){
      return moment(date).fromNow();
    },
    titleLiked: function(id){
      return Story.findOne(id).title;
    },
    descriptionLiked: function(id){
      return Story.findOne(id).description;
    },
    genreLiked: function(id){
      return Story.findOne(id).genre;
    },
    ratingLiked: function(id){
      return Story.findOne(id).rating;
    },
    wordCountLiked: function(id){
      return Story.findOne(id).wordCount;
    },
    chaptersLiked: function(id){
      return Story.findOne(id).chapters;
    },
    updateDateLiked: function(id){
      return moment(Story.findOne(id).updateDate).fromNow();
    },
    uploadDateLiked: function(id){
      return moment(Story.findOne(id).uploadDate).fromNow();
    },
    statusLiked: function(id){
      return Story.findOne(id).status;
    },
    likesLiked: function(id){
      return Story.findOne(id).likes;
    },
    authorName: function(id){
      var authorID = Story.findOne(id).author;
      return Meteor.users.findOne(authorID).username;
    },
    authorID: function(id){
      return Story.findOne(id).author;
    }

  });
 Template.editStory.onRendered(function(){
    var id = Session.get('storyId');
    var rating = Story.findOne(id).rating;
    document.getElementById('rating').value = rating;
  });
  Template.editStory.helpers({
    title: function(){
      var id = Session.get('storyId');
      return Story.findOne(id).title;
    },
    genre: function(){
      var id = Session.get('storyId');
      return Story.findOne(id).genre;
    },
    description: function(){
      var id = Session.get('storyId');
      return Story.findOne(id).description;
    }
  });
  Template.editStory.events({
    'submit form': function(){
      event.preventDefault();
      var id = Session.get('storyId');
      var author = Story.findOne(id).author;
      if(author==Meteor.userId()){
      var title = event.target.storytitle.value;
      var rating = event.target.rating.value;
      var genre = event.target.genre.value;
      var desc = event.target.desc.value;
      if(rating != 'G' && rating !='E' && rating !='T' && rating !='R') sAlert.error("Invalid rating!");
      else if(!title || !rating || !genre || !desc) sAlert.error("All fields are required!");
      else{
        Meteor.call('updateStory', id, title, rating, genre, desc);
        var path = '/story/' + id;
        Router.go(path);
      }
    }
    else sAlert.error("Oops, no can do!");
    }
  });
 Template.editChapter.onRendered(function(){
  this.myRevealInstance = new Foundation.Reveal($('#chDeleteConfirmation'));
    tinymce.init({
  selector: 'textarea',  // change this value according to your HTML
  plugins: 'wordcount paste directionality',
  keep_styles: false,
  paste_word_valid_elements: "b,strong,i,em,h1,h2,p,br"
});

  });
 Template.editChapter.onDestroyed(function () {
  let reveal = this.myRevealInstance;
 
  if (reveal) {
    reveal.destroy();
  }
});


 Template.editChapter.helpers({
  storyid: function(){
    return Session.get('storyId');
  },
  note: function(){
    var id = Session.get('storyId');
    var num = parseInt(Session.get('chNum'));
    var ch = Chapters.findOne({story: id, number: num});
    return ch.note;
  },
  content: function(){
    var id = Session.get('storyId');
    var num = parseInt(Session.get('chNum'));
    var ch = Chapters.findOne({story: id, number: num});
    return ch.content;
  }
 });

 Template.editChapter.events({
  'submit form': function(){
     event.preventDefault();
    var id = Session.get('storyId');
    var num = parseInt(Session.get('chNum'));
      var note = event.target.note.value;
      var content = event.target.chContent.value;
      var countString = document.getElementById('mceu_31').innerHTML;
      var res = countString.substr(7);
      var wordcount = parseInt(res); //remove parseInt when input isn't string 
      var author = Story.findOne(id).author;
      var oldwords = Story.findOne(id).wordCount;
      var difference = wordcount - oldwords;
      if(author==Meteor.userId()){
      if(!content) sAlert.warning("Chapter must have content!");
      else{Meteor.call('editChapter', id, num, note, content, difference);
      var pathToStory = '/story/' + id;
      Router.go(pathToStory);}}
      else sAlert.error("You're not permitted to do this!");
  },
    'click #chConfirmDelete': function(){
      var story = Session.get('storyId');
      var num = parseInt(Session.get('chNum'));
      var author = Story.findOne(story).author;
      if(author == Meteor.userId()){
        Meteor.call('deleteChapter', story, num);
      }else sAlert.error("Oops, you're not allowed to do that!");
      var path = '/story/' + story;
      Router.go(path);
    }
 });



 Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });
  
}
//here we have the server part


if (Meteor.isServer) {
  /*Meteor.publish('showUserOnly', function(){
  return Story.find({genre: 'G'});
 });*/ 
//FOR INDIVIDUAL PROFILES, PUBLISH USER PROFILES

  Meteor.methods({

    profileUpdate: function(name, dob, bio){
      Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.name": name, "profile.dob": dob, "profile.bio": bio, "profile.completed": true}});
    },
    addStory: function(title, desc, rating, genre){
      Story.insert({title: title, description: desc, rating: rating, genre: genre}, function(e, r){
        if(e){
          for(var i=0; i<Story.simpleSchema().namedContext().invalidKeys().length; i++)
           throw new Meteor.Error(Story.simpleSchema().namedContext().invalidKeys()[i].message);
       }
      });
    },
    addChapter: function(storyid, note, content, wordcount){
      var st = Story.findOne(storyid);
      var num = st.chapters + 1;  //TODO only increment story chapters if insert was successful. 
      if(st.author === Meteor.userId()){
      Chapters.insert({note: note, content: content, wordCount: wordcount, story: storyid, number: num});
      Story.update({_id: storyid}, {$inc: {chapters: 1, wordCount: wordcount}, $set: {updateDate: new Date()}}); 
    }
    },
    editChapter: function(id, num, note, content, diff){
      var st = Story.findOne(id);
      if(st.author===Meteor.userId()){
        Chapters.update({story: id, number: num}, {$set: {note: note, content: content}, $inc: {wordCount: diff}});
        Story.update({_id: id}, {$inc: {wordCount: diff}});
      }
    },
    updateStory: function(id,title,rating,genre,desc){
      Story.update({_id: id, author: Meteor.userId()}, {$set: {title: title, rating: rating, genre:genre, description: desc}});
    },
    deleteStory: function(storyid){
      var st = Story.findOne(storyid);
      if(st.author === Meteor.userId()){Story.remove({_id: storyid});
      Chapters.remove({story: storyid});
      Likes.remove({story: storyid});}
      
    },
    like: function(storyId, userId){
      var present = Likes.findOne({story: storyId, liker: userId});
      if(present) {
        Likes.remove({story: storyId, liker: userId});
        Story.update({_id: storyId}, {$inc: {likes: -1}});
      }
      else {
        Likes.insert({story: storyId, liker: userId});
        Story.update({_id: storyId}, {$inc: {likes: 1}});
      }
    },
    deleteChapter: function(id, num){
      var st = Story.findOne(id);
      var wc = Chapters.findOne({story: id, number: num}).wordCount;
      var diff = st.wordCount - wc;
      var old = st.chapters;
      if(st.author === Meteor.userId()){
        Chapters.remove({story: id, number: num});
        Story.update({_id: id}, {$inc: {chapters: -1}, $set: {wordCount: diff}});
        if(num<old){
          Chapters.update({number: {$gt: num}}, {$inc: {number: -1}});
        }
      }
    }
  });
}


