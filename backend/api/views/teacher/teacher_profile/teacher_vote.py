from rest_framework.views import APIView
from django.http import JsonResponse
from api.models import VoteForQuestion, VoteForAnswer
from api.views.auth.authHelper import get_authenticated_user

class TeacherProfileVoteView(APIView):
    def get(self, request):
        user, error_response = get_authenticated_user(request)
        if error_response:
            return error_response

        # Votes for Questions
        question_votes = VoteForQuestion.objects.filter(user=user)
        upvotes_q = question_votes.filter(vote_type="like").count()
        downvotes_q = question_votes.filter(vote_type="dislike").count()

        # Votes for Answers
        answer_votes = VoteForAnswer.objects.filter(user=user)
        upvotes_a = answer_votes.filter(vote_type="like").count()
        downvotes_a = answer_votes.filter(vote_type="dislike").count()

        return JsonResponse({
            "upvotes": upvotes_q + upvotes_a,
            "downvotes": downvotes_q + downvotes_a,
            "question_votes": question_votes.count(),
            "answer_votes": answer_votes.count()
        })
