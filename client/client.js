 Meteor.subscribe('notify');
  Meteor.subscribe('users');
 
 

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
Template.topBar.helpers({
  isLarge: function(){
    var size =  $(window).width() / parseFloat($("body").css("font-size"));
    if(size>=40) return true;
    else return false;
  },
      isSmall: function(){
          var size = $(window).width() / parseFloat($("body").css("font-size"));
          if(size<40) return true;
          else return false;
      }
});

    Template.topNav.onRendered(function(){
       $(document).foundation();
      
    });
    Template.topNav.helpers({
      id: function(){
        return Meteor.userId();
      },
      alerts: function(){
        var id = Meteor.userId();
        var then, number;
        if(Meteor.user().profile.lastVisit) {then = Meteor.user().profile.lastVisit; 
          number = Notifications.find({user: id, date: {$gt: then}}).count();
          }
        else number= Notifications.find({user: id}).count();
       
         return number;
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
      return Story.find({wordCount: {$ne: 0}}, {sort: {updateDate: -1}, limit:3});
    },
    fromNow: function(date){
      return moment(date).fromNow();
    },
    authorName: function(id){
      var author = Meteor.users.findOne(id);
       return author.username;
    },
    locale: function(num){
      return num.toLocaleString('en');
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
    totalComments: function(){
      var id = Session.get('thisStory');
      return Story.findOne(id).comments;
    },
    followed: function(){
      var story = Session.get('thisStory');
      var user = Meteor.userId();
      var follow = Follows.findOne({story: story, follower: user});
      if(follow) return true;
      else return false;
    },
    follows: function(){
      var id = Session.get('thisStory');
      var num = Story.findOne(id).follows;
      return num;
    },
    followCounter: function(num){
      if(num==0) return " follows so far. Be the first to follow this!";
      else if (num==1) return " person follows this.";
      else return " people follow this.";
    },
    canDisplay: function(){
      var id = Session.get('thisStory');
      return Story.findOne(id).displayChapterNumbers;
    },
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
    },
    comments: function(num){
      var id = Session.get('thisStory');
      return Comments.find({chapter: num}).count();
    },
    message: function(num){
      var id = Session.get('thisStory');
      var count = Comments.find({chapter: num}).count();
      if(count==0) return "Be the first to comment!";
      else return "Join the discussion!";
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
      var st = Story.findOne(story).author;
      var user = Meteor.userId();
      if(!user){sAlert.warning("You have to be logged in to like this!");}
      else if(user==st){sAlert.warning("You can't like your own story, sorry!");}
      else {Meteor.call('like', story, user);}
    },
    'click #follow-button': function(){
      var story = Session.get('thisStory');
      var st = Story.findOne(story).author;
      var user = Meteor.userId();
      if(!user){sAlert.warning("You have to be logged in to follow this!");}
      else if(user==st){sAlert.warning("You can't follow your own story, sorry!");}
      else{Meteor.call('follow', story, user);}
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
      var disp = event.target.dispChapters.checked;
      var check;
      if(disp) check = false;
      else check = true;
      if(rating != 'G' && rating !='E' && rating !='T' && rating !='R') sAlert.error("Invalid rating!");
      else if(!title || !rating || !genre || !desc) sAlert.error("All fields are required!");
      else{Meteor.call('addStory', title, desc, rating, genre, check); var pathToProfile = '/profile/' + Meteor.userId();
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
      var complete = event.target.completed.checked;
      var status;
      if(complete) status = "Complete";
      else status = "Work-In-Progress";
      if(author==Meteor.userId()){
      if(!content) sAlert.warning("Chapter must have content!");
      else{Meteor.call('addChapter', storyid, note, content, wordcount, status);
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
    commentsLiked: function(id){
      return Story.findOne(id).comments;
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
    var st = Story.findOne(id);
    var rating = st.rating;
    document.getElementById('rating').value = rating;
    var check = Story.findOne(id).displayChapterNumbers;
    document.getElementById('checkbox4').checked = !check;
    var genre = st.genre;
    document.getElementById('genre').value = genre;
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
      var disp = event.target.dispChapters.checked;
      var check;
      if(disp) check = false;
      else check = true;
      if(rating != 'G' && rating !='E' && rating !='T' && rating !='R') sAlert.error("Invalid rating!");
      else if(!title || !rating || !genre || !desc) sAlert.error("All fields are required!");
      else{
        Meteor.call('updateStory', id, title, rating, genre, desc, check);
        var path = '/story/' + id;
        Router.go(path);
      }
    }
    else sAlert.error("Oops, no can do!");
    }
  });
 Template.editChapter.onRendered(function(){
  var id = Session.get('storyId');
  var num = Session.get('chNum');
  var stry = Story.findOne(id);
  var st = stry.status;
  var ch = stry.chapters;
   if(st == 'Complete' && num == ch) document.getElementById("checkbox2").checked = true;
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
      var check = event.target.completed.checked;
      var status;
      if(check) status = "Complete";
      else status = "Work-In-Progress";
      if(author==Meteor.userId()){
      if(!content) sAlert.warning("Chapter must have content!");
      else{Meteor.call('editChapter', id, num, note, content, difference, status);
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
      location.reload();
    }
 });

  Template.feed.helpers({
    hasFollowed: function(){
      var user = Meteor.userId();
      if(!Follows.findOne({follower: user})) return false;
      else return true;
    },
    followedStory: function(){
      var id = Meteor.userId();
      return Follows.find({follower: id}, {sort: {date: -1}});
    },
    titleFollowed: function(id){
      return Story.findOne(id).title;
    },
    authorFollowed: function(id){
      return Story.findOne(id).author;
    },
    authorName: function(id){
      var authorId = Story.findOne(id).author;
      return Meteor.users.findOne(authorId).username;
    },
    descriptionFollowed: function(id){
      return Story.findOne(id).description;
    },
    genreFollowed: function(id){
      return Story.findOne(id).genre;
    },
    ratingFollowed: function(id){
      return Story.findOne(id).rating;
    },
    wordCountFollowed: function(id){
      return Story.findOne(id).wordCount;
    },
    chaptersFollowed: function(id){
      return Story.findOne(id).chapters;
    },
    updateDateFollowed: function(id){
      var d = Story.findOne(id).updateDate;
      return moment(d).fromNow();
    },
    uploadDateFollowed: function(id){
      var d = Story.findOne(id).uploadDate;
      return moment(d).fromNow();
    },
    statusFollowed: function(id){
      return Story.findOne(id).status;
    },
    likesFollowed: function(id){
      return Story.findOne(id).likes;
    },
    commentsFollowed: function(id){
      return Story.findOne(id).comments;
    }
  });
  Template.alerts.onRendered(function(){
    //iron router wouldn't render it if user wasn't signed in
    Session.set('previousVisit', Meteor.user().profile.lastVisit);
    Meteor.call('setVisit');
  }); 
  Template.alerts.helpers({

    hasAlerts: function(){
      var id = Meteor.userId();
      if(Notifications.findOne({user: id})) return true;
      else return false;
    },
    isNew: function(date){
      var then = Session.get('previousVisit');
      if(date>then) return true;
      else return false;
    },
    alert: function(){
      var id = Meteor.userId();
      var al = Notifications.find({user: id}, {sort: {date: -1}});
      return al;
    },
    setType: function(type){
      Session.set('alertType', type);
    },
    isLike: function(type){
      if(type=='L') return true;
      else return false;
    },
    isFollow: function(type){
      if(type=='F') return true;
      else return false;
    },
    isUpdate: function(type){
      if(type=='U') return true;
      else return false;
    },
    isComment: function(type){
      if(type=='C') return true;
      else return false;
    },
    person: function(type, id){
      if(type=='F'){
        var follow = Follows.findOne(id).follower;
        return Meteor.users.findOne(follow).username;
      }
      else if(type=='L'){
        var like = Likes.findOne(id).liker;
        return Meteor.users.findOne(like).username;
      }
      else if(type=='C'){
        var comment = Comments.findOne(id).commenter;
        return Meteor.users.findOne(comment).username;
      }
     
    },
    personId: function(type, id){
      if(type=='F'){
        var follow = Follows.findOne(id).follower;
        return follow;
      }
      else if(type=='L'){
        var like = Likes.findOne(id).liker;
        return like;
      }
      else if(type=='C'){
        var comment = Comments.findOne(id).commenter;
        return comment;
      }
    },
    message: function(type, id){
      if(type=='F'){
        return "followed your story ";
      }
      else if(type=='L'){
        return "liked your story ";
      }
      else if(type=='U'){
        return "was updated.";
      }
      else if(type=='C'){
        var comment = Comments.findOne(id);
        return 'commented on <a href="/story/'+ comment.story +'/'+ comment.chapter + '">Chapter ' + comment.chapter + '</a> of your story ';
      }
    },
    object: function(type, id){
      if(type=='F'){
        var follow = Follows.findOne(id).story;
        var st = Story.findOne(follow);
        return '"' + st.title + '"';
      }
      else if(type=='L'){
        var like = Likes.findOne(id).story;
        var stry = Story.findOne(like);
        return '"' + stry.title + '"';
      }
       else if(type=='U'){
        return Story.findOne(id).title;
      }
      else if(type=='C'){
        var s = Comments.findOne(id).story;
        return '"'+ Story.findOne(s).title+'"';
      }
    },
    objectID: function(type, id){
       if(type=='F'){
        return Follows.findOne(id).story;
      }
      else if(type=='L'){
        return Likes.findOne(id).story;
      }
       else if(type=='U'){
        return id;
      }
      else if(type=='C'){
        return Comments.findOne(id).story;
      }
    },
    fromNow: function(date){
      return moment(date).fromNow();
    }
  });

Template.showChapter.helpers({
  title: function(){
    var story = Session.get('storyId');
    return Story.findOne(story).title;
  },
  myProfile: function(){
    var myId = Meteor.userId();
    var story = Session.get('storyId');
    var author = Story.findOne(story).author;
    if(myId==author) return true;
    else return false;
  },
  storyid: function(){
    return Session.get('storyId');
  },
  number: function(){
    return Session.get('chNum');
  },
  canDisplay: function(){
    var id = Session.get('storyId');
    var check = Story.findOne(id).displayChapterNumbers;
    if(check) return true;
    else return false;
  },
  hasNote: function(){
    var id = Session.get('storyId');
    var ch = parseInt(Session.get('chNum'));
    if(Chapters.findOne({story: id, number: ch}).note) return true;
    else return false;
  },
  note: function(){
    var id = Session.get('storyId');
    var ch = parseInt(Session.get('chNum'));
    return Chapters.findOne({story: id, number: ch}).note;
  },
  content: function(){
    var id = Session.get('storyId');
    var ch = parseInt(Session.get('chNum'));
    return Chapters.findOne({story: id, number: ch}).content;
  },
  commentContent: function(){
    var id = Session.get('storyId');
    var ch = parseInt(Session.get('chNum'));
    return Comments.find({story: id, chapter: ch});
  },
  username: function(id){
    return Meteor.users.findOne(id).username;
  },
  fromNow: function(date){
    return moment(date).fromNow();
  },
  canDelete: function(commenterId, id){
    var user = Meteor.userId();
    var st = Session.get('storyId');
    var author = Story.findOne(st).author;
    if(user==commenterId || user==author)   return true;
    return false;

  }
});

Template.showChapter.events({
  'keyup #comment-textarea': function(){
      var x = event.target.value.length;
      document.getElementById('counter2').innerHTML = "Characters left = " + (500-x);

    },
    'submit form': function(){
      event.preventDefault();
      var comment = event.target.comment.value;
      var ID = Meteor.userId();
      var story = Session.get('storyId');
      var chapter = parseInt(Session.get('chNum'));
      if(ID){
        Meteor.call('comment', ID, story, chapter, comment);
      }
      else sAlert.warning("You must be signed in to comment!");
      event.target.comment.value = "";
    }
});

Template.browse.helpers({
  isLarge: function(){
    var size =  $(window).width() / parseFloat($("body").css("font-size"));
    if(size>=40) return true;
    else return false;
  },
  result: function(){
    var sortby = Session.get('sortbyResult');
    var sortorder = Session.get('sortorderResult');
    var sortNum;
    if(sortorder == 'ascendingly') sortNum=1;
    else sortNum=-1;
    if(sortby=='update') return Story.find({}, {sort:{updateDate: sortNum}});
    else if(sortby=='likes') return Story.find({}, {sort:{likes: sortNum}});
    else if(sortby=='comments') return Story.find({}, {sort: {comments: sortNum}});
    else if(sortby=='wordcount') return Story.find({}, {sort: {wordCount: sortNum}});


  },
  authorName: function(id){
    return Meteor.users.findOne(id).username;
  },
  fromNow: function(date){
    return moment(date).fromNow();
  },
  hasResults: function(){
    if(Story.findOne()) return true;
    else return false;
  }
});


Template.quickBrowse.events({
  'submit form': function(){
    event.preventDefault();
    var genre = event.target.genre.value;
    var rating = event.target.rating.value;
    var status = event.target.status.value;
    var sortby = event.target.sortby.value;
    var sortorder = event.target.sortorder.value;
    if(!genre || !rating || !status || !sortby || !sortorder) sAlert.error("All fields are required!");
    else {
      Router.go('browse.results', {genre: genre, rating: rating, status: status, sortby: sortby, sortorder: sortorder});
    }
  }
});



 Accounts.ui.config({
    passwordSignupFields: "USERNAME_AND_EMAIL"
  });
  