from django.apps import AppConfig
import threading

class ApiConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'api'

    def ready(self):
        from django.db.utils import OperationalError, ProgrammingError
        from django.db import connection

        def run_initial_data():
            from django.contrib.auth.models import User
            from api.models import Reputation, ReputationPermission, AutoApproveSetting
            from datetime import date

            try:
                if not connection.introspection.table_names():
                    return  # DB chưa migrate

                admin_user = User.objects.filter(id=7).first()  # Tuỳ user ID

                # -------------------
                # Mặc định điểm uy tín
                default_reputations = [
                    ('new_user', 'Người dùng mới', 10),
                    ('upvote_question', 'Câu hỏi được upvote', 5),
                    ('upvote_answer', 'Câu trả lời được upvote', 10),
                    ('answer_accepted', 'Câu trả lời được chọn đúng', 15),
                    ('downvote_question', 'Câu hỏi bị downvote', -2),
                    ('downvote_answer', 'Câu trả lời bị downvote', -2),
                    ('downvote_penalty', 'Bạn downvote người khác', -1),
                ]
                for key, desc, point in default_reputations:
                    Reputation.objects.get_or_create(
                        rule_key=key,
                        defaults={
                            'description': desc,
                            'point_change': point,
                            'user_id_last_update': admin_user
                        }
                    )

                # -------------------
                # Mặc định quyền hành động theo uy tín
                default_permissions = [
                    ('ask_question', 'Đặt câu hỏi', 4),
                    ('post_answer', 'Trả lời câu hỏi', 5),
                    ('comment', 'Bình luận', 2),
                ]
                for key, desc, min_rep in default_permissions:
                    ReputationPermission.objects.get_or_create(
                        action_key=key,
                        defaults={
                            'description': desc,
                            'min_reputation': min_rep,
                            'user_id_last_update': admin_user
                        }
                    )

                # -------------------
                # Mặc định cấu hình auto duyệt
                auto_approve_defaults = [
                    ('question', False),
                    ('answer', False),
                    ('comment', False),
                    ('courses', False),
                ]
                today = date.today()
                for type_key, enabled in auto_approve_defaults:
                    AutoApproveSetting.objects.get_or_create(
                        type=type_key,
                        defaults={
                            'enabled': enabled,
                            'from_date': today,
                            'to_date': today.replace(year=today.year + 1)  # Mặc định trong 1 năm
                        }
                    )

            except (OperationalError, ProgrammingError):
                # DB chưa sẵn sàng/migrate
                pass

        threading.Thread(target=run_initial_data).start()
