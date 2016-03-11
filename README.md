# Oktob

## Table of Contents:
* [Overview](#overview)
* [Installation](#installation)
* [Architecture](#architecture)
* [Front-End](#front-end)
* [Back-End](#back-end)
* [Screenshots](#screenshots)

## Overview
Oktob is a writing platform that allows people to:
* Post (and, of course, edit) stories with multiple chapters.
* Like/Bookmark stories (liked stories get displayed publicly on user profiles)
* Follow stories and get notified when/if they're updated (list of followed stories by x are only viewable to x on their home page)
* Comment on individual chapters.
* Browse through stories based on genre, rating, word count, number of likes, number of comments.
* Get notified when someone follows, likes or comments on their work.

There's a depoloyed version of it [here](http://oktob.meteor.com) (as of March 25, 2016 this version will no longer work as Meteor will be taking down the free hosting and Netflix > paying to host a prototype).

## Installation
First of all, you'll need to install Meteor ([find instructions here](https://www.meteor.com/install)). This works on OS X, Windows, and Linux (Meteor does all the magic anyway).

Next, you'll clone this repo:
```
git clone https://github.com/blaringsilence/Oktob.git
```
Then you can run the project via:
```
cd oktob
meteor
```

## Architecture
(Fancy word for what you'll find in those folders)

- Client: everything front-end (templates, front-end JavaScript, css/scss)
- Server: everything back-end
- Public: the favicon (also where you'd put anything that you want directly accessible via http)
- Other files: run on both the client and the server. That includes the database schema, and the routes.

Also, there are several packages used (like iron-router, etc) to build this. Meteor should install them automatically when you first run the app, but for your information, they are all listed [here](/.meteor/packages).

## Front-End
Meteor uses those handy things called templates (in .html) that use variables/methods from template helpers. More about that [in the Meteor docs](http://docs.meteor.com/#/basic/defining-templates).

The underlying framework for the html is ZURB's Foundation (v6.2.0), documentation for which can be found [here](http://foundation.zurb.com/sites/docs/).

All the helpers are in the `client/client.js` file. Each template has its own .html file, but `client/main.html` is always there, and other templates are rendered into it accordingly (iron-router in `routes.js` determines which template gets rendered).

## Back-End
All the methods can be found in `server/methods.js` file. If you're not familiar with Meteor methods, they're basically, well, methods that get executed on the server (but don't return anything to the client). 

There's also `server/publish.js`, which accesses the database and returns the data relevant to the client/requested by the client.

## Screenshots
/:

![Image of home view, top](http://i.imgur.com/MPIuqeP.png)

![Image of home view, bottom](http://i.imgur.com/jiyXYPs.png)

/alerts:

![Image of 1 new alert notification](http://i.imgur.com/aov1L4B.png)

![Image of alerts with 1 new alert](http://i.imgur.com/Z7Im4pQ.png)

All the adds:

![Image of adding a new story](http://i.imgur.com/gUmei9q.png)

![Image of adding chapter to a story](http://i.imgur.com/uKcXvXy.png)

All the views:

![Image of a full story view](http://i.imgur.com/2EkTjYT.png)

![Image of single chapter view](http://i.imgur.com/bZmhKBt.png)

/browse:

![Image of the browse screen](http://i.imgur.com/NKyL6zF.png)

![Image of results page](http://i.imgur.com/9YlgpLP.png)

/profile (logged in)

![Image of logged in profile](http://i.imgur.com/05hcxOy.png)
