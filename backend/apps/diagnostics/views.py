from rest_framework import mixins, permissions, status, viewsets
from rest_framework.response import Response

from .groq_service import analyze_with_groq
from .models import DiagnosticRequest
from .serializers import DiagnosticCreateSerializer, DiagnosticSerializer


class DiagnosticViewSet(
    mixins.CreateModelMixin,
    mixins.ListModelMixin,
    mixins.RetrieveModelMixin,
    viewsets.GenericViewSet,
):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return DiagnosticRequest.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return DiagnosticCreateSerializer
        return DiagnosticSerializer

    def get_serializer_context(self):
        ctx = super().get_serializer_context()
        ctx["request"] = self.request
        return ctx

    def create(self, request, *args, **kwargs):
        serializer = DiagnosticCreateSerializer(
            data=request.data, context={"request": request}
        )
        serializer.is_valid(raise_exception=True)
        diagnostic = serializer.save(
            user=request.user,
            status="processando",
        )

        llm_response = analyze_with_groq(diagnostic.vehicle, diagnostic.description)
        severity = llm_response.get("severity", "medio")

        diagnostic.llm_response = llm_response
        diagnostic.severity = severity
        diagnostic.status = "concluido" if "error" not in llm_response else "erro"
        diagnostic.save()

        return Response(
            DiagnosticSerializer(diagnostic).data,
            status=status.HTTP_201_CREATED,
        )
