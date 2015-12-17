Meteor.methods({

    profileUpdate: function(name, dob, bio){
      Meteor.users.update({_id: Meteor.userId()}, {$set: {"profile.name": name, "profile.dob": dob, "profile.bio": bio, "profile.completed": true}});
    },
    addStory: function(title, desc, rating, genre, check){
      Story.insert({title: title, description: desc, rating: rating, genre: genre, displayChapterNumbers: check}, function(e, r){
        if(e){
          for(var i=0; i<Story.simpleSchema().namedContext().invalidKeys().length; i++)
           throw new Meteor.Error(Story.simpleSchema().namedContext().invalidKeys()[i].message);
       }
      });
    },
    addChapter: function(storyid, note, content, wordcount, status){
      var st = Story.findOne(storyid);
      var num = st.chapters + 1;  //TODO only increment story chapters if insert was successful. 
      if(st.author === Meteor.userId()){
      Chapters.insert({note: note, content: content, wordCount: wordcount, story: storyid, number: num});
      Story.update({_id: storyid}, {$inc: {chapters: 1, wordCount: wordcount}, $set: {updateDate: new Date(), status:status}}); 
      Follows.find({story: storyid}).forEach(function(myStory){
        Notifications.insert({user: myStory.follower, id: storyid, type: 'U'});
      });
    }
    },
    editChapter: function(id, num, note, content, diff, status){
      var st = Story.findOne(id);
      if(st.author===Meteor.userId()){
        Chapters.update({story: id, number: num}, {$set: {note: note, content: content}, $inc: {wordCount: diff}});
        Story.update({_id: id}, {$inc: {wordCount: diff}, $set: {status: status}});
      }
    },
    updateStory: function(id,title,rating,genre,desc,check){
      Story.update({_id: id, author: Meteor.userId()}, {$set: {title: title, rating: rating, genre:genre, description: desc, displayChapterNumbers: check}});
    },
    deleteStory: function(storyid){
      var st = Story.findOne(storyid);
      if(st.author === Meteor.userId()){
      Story.remove({_id: storyid});
      Chapters.remove({story: storyid});
      Comments.find({story: storyid}).forEach(function(myComment){
        var x = myComment._id;
       if(Notifications.findOne({type: 'C', id: x})) Notifications.remove({type: 'C', id: x});
      });
      Comments.remove({story: storyid});
      Likes.find({story: storyid}).forEach(function(myLike){
        var x = myLike._id;
        if(Notifications.findOne({type: 'L', id: x})) Notifications.remove({type: 'L', id: x});
      });
      Likes.remove({story: storyid});
      Follows.find({story: storyid}).forEach(function(myFollow){
        var x = myFollow._id;
        if(Notifications.findOne({type:'F', id: x})) Notifications.remove({type: 'F', id: x});
      });
      Follows.remove({story: storyid});

    }
      
    },
    like: function(storyId, userId){
      var present = Likes.findOne({story: storyId, liker: userId});
      var author = Story.findOne(storyId).author;
      if(present) {
        var id = present._id;
        Likes.remove({story: storyId, liker: userId});
        Story.update({_id: storyId}, {$inc: {likes: -1}});
        Notifications.remove({id: id, type: 'L'});
      }
      else {
        Likes.insert({story: storyId, liker: userId});
        Story.update({_id: storyId}, {$inc: {likes: 1}});
        var likeId = Likes.findOne({story: storyId, liker: userId})._id;
        Notifications.insert({user: author, id: likeId, type: 'L'});

      }
    },
    follow: function(storyId, userId){
      var present = Follows.findOne({story: storyId, follower: userId});
      var author = Story.findOne(storyId).author;
      if(present){
        var id = present._id;
        Follows.remove({story: storyId, follower: userId});
        Story.update({_id: storyId}, {$inc: {follows: -1}});
        Notifications.remove({id: id, type: 'F'});
      }
      else {
        Follows.insert({story: storyId, follower: userId});
        Story.update({_id: storyId}, {$inc: {follows: 1}});
        var followId = Follows.findOne({story: storyId, follower: userId})._id;
        Notifications.insert({user: author, id: followId, type: 'F'});
      }
    },
    deleteChapter: function(id, num){
      var st = Story.findOne(id);
      var wc = Chapters.findOne({story: id, number: num}).wordCount;
      var diff = st.wordCount - wc;
      var old = st.chapters;
      if(st.author === Meteor.userId()){
        Comments.find({story: id, chapter: num}).forEach(function(myComment){
          var x = myComment._id;
          if(Notifications.findOne({type: 'C', id: x})) Notifications.remove({type: 'C', id: x});
          Story.update({_id: id}, {$inc: {comments: -1}});
        });
        Comments.remove({story: id, chapter: num});
        Chapters.remove({story: id, number: num});
        
        if(num<old){
          Chapters.update({number: {$gt: num}}, {$inc: {number: -1}});
        }
        else if(num==old && st.status == 'Complete') Story.update({_id: id}, {$set: {status: "Work-In-Progress"}});

        Story.update({_id: id}, {$inc: {chapters: -1}, $set: {wordCount: diff}});
      }
    },
    setVisit: function(){
      var id = Meteor.userId();
      Meteor.users.update({_id: id}, {$set: {"profile.lastVisit": new Date()}});
    },
    comment: function(id, story, chapter, comment){
      id = Meteor.userId(); //triple checking lol
      var date = new Date();
      if(id){
        Comments.insert({commenter: id, story: story, chapter: chapter, comment: comment, date: date});
        Story.update({_id: story}, {$inc: {comments: 1}});
        var commentID = Comments.findOne({$query: {commenter: id, story: story, chapter: chapter, comment: comment}, $orderby: {$natural : -1}})._id; //Gets LAST inserted record with these fields, so it's accurate even though none of them are keys
        var st = Story.findOne(story).author;
        if(st!=id)
          Notifications.insert({user: st, id: commentID, type: 'C'});
      }
    },
    deleteComment: function(id){
      var user = Meteor.userId();
      var comm = Comments.findOne(id);
      var op = comm.commenter;
      var author = Story.findOne(comm.story).author;
      if(user == op || user == author){
        Comments.remove(id);
        Story.update({_id: comm.story}, {$inc: {comments: -1}});
        Notifications.remove({id: id, type: 'C'});
      }
    }
  });