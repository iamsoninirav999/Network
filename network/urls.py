
from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("login", views.login_view, name="login"),
    path("logout", views.logout_view, name="logout"),
    path("register", views.register, name="register"),
    
    #API CALLS
    path('posts/',views.get_post_send_post,name="get_post_send_post"),
    path('posts/<int:id>',views.edit_post,name="edit_post"),
    path('like_unlike/<int:id>',views.like_unlike_post,name='like_unlike_post'),
    path('profile/<str:name>',views.profile,name="profile"),
    path('following',views.following,name="following"),
    path('follow_unfollow/',views.follow_unfollow,name="follow_unfollow"),
    
]
