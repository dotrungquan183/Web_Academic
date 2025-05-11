from rest_framework.views import APIView
from django.http import JsonResponse
from api.models import Vote
from api.views.auth.authHelper import get_authenticated_user

class TeacherProfileVoteView(APIView):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        votes = Vote.objects.filter(user=user)

        upvotes = votes.filter(vote_type="like").count()
        downvotes = votes.filter(vote_type="dislike").count()
        question_votes = votes.filter(vote_for="question").count()
        answer_votes = votes.filter(vote_for="answer").count()

        return JsonResponse({
            "upvotes": upvotes,
            "downvotes": downvotes,
            "question_votes": question_votes,
            "answer_votes": answer_votes
        })
