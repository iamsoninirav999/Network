from django.contrib.auth import authenticate, login, logout
from django.db import IntegrityError
from django.http import HttpResponse, HttpResponseRedirect,JsonResponse
from django.shortcuts import render
from django.urls import reverse
from django.views.decorators.csrf import csrf_exempt
from .models import User,Post
from django.contrib.auth.decorators import login_required
from django.core.paginator import Paginator
import json


def index(request):
    return render(request, "network/index.html")

@csrf_exempt
def get_post_send_post(request):
    if request.method == "POST":
        data = json.loads(request.body)
        content=data['content']
        p=Post(user=request.user,content=content)
        p.save()
    posts = Post.objects.all().order_by('-time')
    list_of_posts=[]
    page_number=request.GET.get('page')
    if page_number!=None:
        pass
    else:
        page_number=1
    p=Paginator(posts,10)
    # print(p.page(page_number).has_next())
    for post in p.get_page(page_number).object_list:
        list_of_posts.append(post.serialize())
    list_of_posts.append({
        'loggedin_user':request.user.username, #so that we can access requested user
        'has_previous':p.page(page_number).has_previous(),
        'last_page_number':p.num_pages,
        'current_page':page_number,
        'has_next':p.page(page_number).has_next()
        })
    return JsonResponse(list_of_posts,safe=False)

@csrf_exempt
def edit_post(request,id):
    if request.method == "PUT":
        post_obj=Post.objects.get(id=id)
        data=json.loads(request.body)
        post_obj.content=data["content"]
        post_obj.save()
    return JsonResponse({'message':'success'},safe=False)

@csrf_exempt
def like_unlike_post(request,id):
    data=json.loads(request.body)
    user=User.objects.get(username=data['user'])
    if request.method == "PUT":
        if data['liked'] == False: #if its false and request coming means we have add that user to liked list
            Post.objects.get(id=id).like.add(user)
        elif data['liked'] == True:
            Post.objects.get(id=id).like.remove(user)
    return HttpResponse(status=204)
            
def profile(request,name):
    # print(str(request.user)==str(name))
    if(str(request.user)==str(name)):
        return HttpResponse('<h1>You can\'t access your own profile page</h1>')
    followers_list=[]
    f=False
    for i in User.objects.get(username=name).followers.all():
        followers_list.append(i.username)
    if request.user.username in followers_list:
        f=True
    following=User.objects.get(username=name).following.all()
    followers=User.objects.get(username=name).followers.all()
    profile_posts=Post.objects.all().filter(user=User.objects.get(username=name).id).order_by('-time')
    context={
        'name':name,
        'following':following,
        'following_count':following.count(),
        'followers':followers,
        'followers_count':followers.count(),
        'profile_posts':profile_posts,
        'f':f
    }
    return render(request,'network/profile.html',context)

def following(request):
    dict_following=[]
    userx=User.objects.get(id=request.user.id)
    for i in userx.following.all():
        for post in Post.objects.all().filter(user_id=i.id):
            dict_following.append(post)
    return render(request,'network/following.html',{'following':dict_following})

@csrf_exempt
def follow_unfollow(request):
    if request.method=="PUT":
        data=json.loads(request.body)
        if data['follow_or_unfollow']=='follow':
            user_obj=User.objects.get(id=request.user.id)
            user_obj.following.add(User.objects.get(username=data['user']))
        if data['follow_or_unfollow']=='unfollow':
            user_obj=User.objects.get(id=request.user.id)
            user_obj.following.remove(User.objects.get(username=data['user']))
        return HttpResponse(status=204)

def login_view(request):
    if request.method == "POST":

        # Attempt to sign user in
        username = request.POST["username"]
        password = request.POST["password"]
        user = authenticate(request, username=username, password=password)

        # Check if authentication successful
        if user is not None:
            login(request, user)
            return HttpResponseRedirect(reverse("index"))
        else:
            return render(request, "network/login.html", {
                "message": "Invalid username and/or password."
            })
    else:
        return render(request, "network/login.html")


def logout_view(request):
    logout(request)
    return HttpResponseRedirect(reverse("index"))


def register(request):
    if request.method == "POST":
        username = request.POST["username"]
        email = request.POST["email"]

        # Ensure password matches confirmation
        password = request.POST["password"]
        confirmation = request.POST["confirmation"]
        if password != confirmation:
            return render(request, "network/register.html", {
                "message": "Passwords must match."
            })

        # Attempt to create new user
        try:
            user = User.objects.create_user(username, email, password)
            user.save()
        except IntegrityError:
            return render(request, "network/register.html", {
                "message": "Username already taken."
            })
        login(request, user)
        return HttpResponseRedirect(reverse("index"))
    else:
        return render(request, "network/register.html")
