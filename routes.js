Router.route('/', {//TODO If something special for home, render here
  loadingTemplate: 'spinner',
  

  waitOn: function () {
    // return one handle, a function, or an array
    if(Meteor.user())
      return [Meteor.subscribe('star'), Meteor.subscribe('homeStories'), Meteor.subscribe('myFollowedStories')];
    else
      return Meteor.subscribe('homeStories');
  },

  action: function () {
    this.render('homeList');
  }
  
});

Router.route('/profile/:_id', {
  loadingTemplate: 'spinner',
  waitOn: function(){
    return [Meteor.subscribe('profileLikes', this.params._id), Meteor.subscribe('theirStories', this.params._id), Meteor.subscribe('storysLiked', this.params._id)];
  },
  action: function(){
  var ID = this.params._id;
  Session.set('profileID', ID);
  var pr = Meteor.users.findOne(ID);
  if(pr){
  if(pr.profile) { if(pr.profile.completed) this.render('showProfile');} 
  else if(ID === Meteor.userId() && !pr.profile) this.render('noProfile');
}
else this.render('notFound');
  }
});

Router.route('/edit-profile', function(){
  if(Meteor.user())
  this.render('editProfile');
  else this.render('noPermission');
});

Router.route('/new-story', function(){
  if(Meteor.user())
  this.render('submitStory');
else this.render('noPermission');
});

Router.route('/story/:_id', {
  loadingTemplate: 'spinner',
  waitOn: function(){
    if(Story.findOne(this.params._id))
      return [Meteor.subscribe('chapters', this.params._id), Meteor.subscribe('profileLikes', Meteor.userId()), Meteor.subscribe('star'), Meteor.subscribe('allComments', this.params._id), Meteor.subscribe('singleStory', this.params._id)];
  },
  action: function(){
  var ID = this.params._id;
  if(!Story.findOne(ID)){this.render('notFound');}
  else {Session.set('thisStory', ID);
  this.render('showStory');} 
}
});

Router.route('/story/:_id/new-chapter', {
  loadingTemplate: 'spinner',
  waitOn: function(){
    return Meteor.subscribe('singleStory', this.params._id);
  },
action: function(){
  var ID = this.params._id;
  Session.set('storyId', ID);
  var st = Story.findOne({_id: ID, author: Meteor.userId()});
  if(st) {this.render('addChapter');}//don't render if ID doesn't exist, 404
  else this.render('noPermission');
}
});

Router.route('/story/:_id/edit', {
  loadingTemplate: 'spinner',
  waitOn: function(){
    return Meteor.subscribe('singleStory', this.params._id);
  },
  action: function(){
  var ID = this.params._id;
  Session.set('storyId', ID);
  var st = Story.findOne({_id: ID, author: Meteor.userId()});
  if(st) this.render('editStory');
  else this.render('noPermission');
}
});

Router.route('/story/:_id/:chapternumber/edit', {
  loadingTemplate: 'spinner',
  waitOn: function(){
      var num = parseInt(this.params.chapternumber);
     return [Meteor.subscribe('singlechapter', this.params._id, num), Meteor.subscribe('singleStory', this.params._id)];
  },
  action: function(){
  var ID = this.params._id;
  var num = parseInt(this.params.chapternumber);
  Session.set('storyId', ID);
  Session.set('chNum', num);
  var st = Story.findOne({_id: ID, author: Meteor.userId()});
  var ch = Chapters.findOne({story: ID, number: num});
  if(st && ch) this.render('editChapter');
  else this.render('noPermission');
}
});

Router.route('/alerts', {
  loadingTemplate: 'spinner',
  waitOn: function(){
    if(Meteor.user())
        return [Meteor.subscribe('relevantNotify1'), Meteor.subscribe('relevantNotify2'), Meteor.subscribe('relevantNotify3'), Meteor.subscribe('theirStories', Meteor.userId()), Meteor.subscribe('myFollowedStories')];
  },
  action: function(){
  if(Meteor.user()) this.render('alerts');
  else this.render('notFound');
}
});

Router.route('/story/:_id/:chapternumber', {
  loadingTemplate: 'spinner',
  waitOn: function(){
    var num = parseInt(this.params.chapternumber);
    return [Meteor.subscribe('singlechapter', this.params._id, num), Meteor.subscribe('comments', this.params._id, num), Meteor.subscribe('singleStory', this.params._id)];
  },
  action: function(){
  var ID = this.params._id;
  var num = this.params.chapternumber;
  Session.set('storyId', ID);
  Session.set('chNum', num);
  var c = parseInt(num);
  if(Chapters.findOne({story: ID, number: c})) this.render('showChapter');
  else this.render('notFound');
}
});

Router.route('/story/:number/:chapter/delete/:_id', function(){
  var id = this.params._id;
  var story = this.params.number;
  var chapter = this.params.chapter;
  Meteor.call('deleteComment', id);
  var path = '/story/' + story + '/' + chapter;
  this.redirect(path);

});

Router.route('/browse', function(){
  this.render('vanillaBrowse');
});

Router.route('/results/:genre/:rating/:status/:sortby/:sortorder', {
  loadingTemplate: 'spinner',
  waitOn: function(){
    return Meteor.subscribe('search', this.params.genre, this.params.rating, this.params.status);
  },
  action: function(){
    Session.set('sortbyResult', this.params.sortby);
    Session.set('sortorderResult', this.params.sortorder);
    this.render('browse');
  },
  name: 'browse.results'
  
});
Router.route('/faq', function(){
  this.render('faq');
});

Router.route('/contact', function(){
  this.render('contact');
});