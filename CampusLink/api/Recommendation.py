import pandas as pd
import numpy as np
from sklearn.feature_extraction import text
from sklearn.metrics.pairwise import cosine_similarity
from .serializers import UserSerializer
from .models import User
from django.views.decorators.csrf import csrf_exempt
from django.http.response import JsonResponse


def recommend_post(df, x):
    return ",".join(df["UserName"].loc[x.argsort()[-6:-1]])

def recommend(request, id):
    df = pd.DataFrame(list(User.objects.all().values()))
    interest = df["Interest"].tolist()
    uni_tfidf = text.TfidfVectorizer(stop_words="english")
    uni_matrix = uni_tfidf.fit_transform(interest)
    uni_sim = cosine_similarity(uni_matrix)
    df["Recommended Users"] = [recommend_post(df, x) for x in uni_sim]
    print(df.head())
    print(df[df['UserID'] == int(id)])
    index_of_User = df[df['UserID'] == int(id)].index.tolist()[0]
    print("Index", index_of_User)
    return userNameToID(df, index_of_User, id)

def userNameToID(df, index_of_user, id):
    userName = df.at[df.index[index_of_user],'Recommended Users'].split(",")
    idList = []
    for i in userName:
        userID = User.objects.get(UserName__iexact=i).UserID
        idList.append(userID)
    print(idList)
    if id in idList:
        print(id)
        idList.remove(id)
    else:
        idList.pop()
    return printUsers(idList)

def printUsers(list):
    users = User.objects.filter(UserID__in=list)
    user_serializer = UserSerializer(users, many=True)
    return JsonResponse(user_serializer.data, safe=False)


def refresh_post(df, x, i):
    if i * 5 <= len(df.index) - 6 and i != 0:
        print("!!!!!!", i)
        return ",".join(df["UserName"].loc[x.argsort()[-6-i*5:-i*5]])
    print("Yahhh", i)
    return ",".join(df["UserName"].loc[x.argsort()[-6:]])

def refresh(request, id, i):
    df = pd.DataFrame(list(User.objects.all().values()))
    interest = df["Interest"].tolist()
    uni_tfidf = text.TfidfVectorizer(stop_words="english")
    uni_matrix = uni_tfidf.fit_transform(interest)
    uni_sim = cosine_similarity(uni_matrix)
    df["Recommended Users"] = [refresh_post(df, x, int(i)) for x in uni_sim]
    print(df.head())
    print(df[df['UserID'] == int(id)])
    index_of_User = df[df['UserID'] == int(id)].index.tolist()[0]
    print("Index", index_of_User)
    return userNameToID(df, index_of_User, int(id))


