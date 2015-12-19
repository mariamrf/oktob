Meteor.publish('singleStory', function(id){
    return Story.find({_id: id});
  });
  Meteor.publish('theirStories', function(id){
    return Story.find({author: id});
  });
  Meteor.publish('homeStories', function(){
    return Story.find({wordCount: {$ne: 0}}, {sort: {updateDate: -1}, limit:3});
  });
 
  Meteor.publish('users', function(){
    return Meteor.users.find({}, {fields: {username: 1, _id: 1, profile: 1}});
  });
  Meteor.publish('notify', function(){
    return Notifications.find({user: this.userId});
  });
  Meteor.publish('star', function(){
    return Follows.find({follower: this.userId});
  });
  Meteor.publish('stories', function(){
    return Story.find();
  });
  Meteor.publish('profileLikes', function(id){
    return Likes.find({liker: id});
  });
  Meteor.publish('chapters', function(id){
    return Chapters.find({story: id});
  });
  Meteor.publish('singlechapter', function(id, ch){
    return Chapters.find({story: id, number: ch});
  });
  Meteor.publish('myFollowedStories', function(){
    var followed = Follows.find({follower: this.userId}).map(function(f){
      return f.story;
    });
    return Story.find({_id:{$in: followed}});
  });
  Meteor.publish('storysLiked', function(id){
    var liked = Likes.find({liker: id}).map(function(l){
      return l.story;
    });
    return Story.find({_id: {$in: liked}});
  });
  Meteor.publish('relevantNotify1', function(){
    var rel = Story.find({author: this.userId}).map(function(notify){
      return notify._id;
    });
    return Likes.find({story:{$in:rel}});
  });
  Meteor.publish('relevantNotify2', function(){
    var rel = Story.find({author: this.userId}).map(function(notify){
      return notify._id;
    });
    return Follows.find({story:{$in:rel}});
  });
   Meteor.publish('relevantNotify3', function(){
    var rel = Story.find({author: this.userId}).map(function(notify){
      return notify._id;
    });
    return Comments.find({story:{$in:rel}});
  });
   Meteor.publish('comments', function(id, num){
    return Comments.find({story: id, chapter: num});
   });
   Meteor.publish('allComments', function(id){
    return Comments.find({story: id}, {fields: {chapter: 1}});
   });

   Meteor.publish('search', function(genre, rating, status){
    var ratingArray, statusArray, genreArray;
    if(rating=='E') ratingArray = ['E', 'R', 'T', 'G'];
    else if (rating=='R') ratingArray = ['R', 'T', 'G'];
    else if (rating=='T') ratingArray = ['T', 'G'];
    else if (rating=='G') ratingArray = ['G'];
    if(status=='Either') statusArray = ['Complete', 'Work-In-Progress'];
    else if(status=='Complete') statusArray=['Complete'];
    else if(status=='Work-In-Progress') statusArray=['Work-In-Progress'];
  
    if(genre=='Any') genreArray = ['Crime/Detective', 'Drama', 'Fanfiction', 'Fantasy', 'Folklore', 'Historical Fiction', 'Horror', 'Humor', 'Magical Realism', 'Metafiction', 'Mystery', 'Mythology', 'Non-fiction', 'Realistic Fiction', 'Science Fiction', 'Short Story', 'Suspense/Thriller', 'Western', 'Other'];

      if(genre!='Any')
        return Story.find({rating: {$in: ratingArray}, status: {$in: statusArray}, genre: genre, wordCount:{$ne: 0}});
      else return Story.find({rating: {$in: ratingArray}, status: {$in: statusArray}, genre: {$in: genreArray}, wordCount:{$ne: 0}});
    

   });