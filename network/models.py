from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    following = models.ManyToManyField("User", related_name='followers',blank=True)

    # def __str__(self):
    #     # return f"{[j.username for j in self.following.all()]}"
    #     return self.name

class Post(models.Model):
    user=models.ForeignKey(User, on_delete=models.CASCADE)
    content=models.CharField(max_length=5000)
    time=models.DateTimeField(auto_now_add=True)
    like=models.ManyToManyField(User,related_name='liked',blank=True)
    
    def __str__(self):
        return f"User : {self.user} & Post Content : {self.content}"

    def serialize(self):
        return {
            'id':self.id,
            'user':self.user.username,
            'content':self.content,
            'time':self.time,
            'like_count':self.like.count(),
            'liked_by':[u.username for u in self.like.all()]
        }
    
