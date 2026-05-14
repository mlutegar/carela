import json
import logging

from django.conf import settings

logger = logging.getLogger(__name__)

SYSTEM_PROMPT = """Você é uma mecânica especialista que ajuda mulheres a entenderem problemas no carro delas.
Sua missão é analisar a descrição e/ou foto do problema e fornecer um diagnóstico claro, empático e em português.

Responda SEMPRE em JSON válido com este formato exato:
{
  "severity": "baixo|medio|alto|urgente",
  "problem_summary": "Resumo do problema em 1-2 frases",
  "explanation": "Explicação detalhada do que provavelmente está acontecendo, em linguagem simples",
  "recommendations": ["ação 1", "ação 2", "ação 3"],
  "estimated_cost_range": "R$ X.XXX - R$ X.XXX (estimativa)",
  "can_drive": true,
  "urgency_note": "Nota sobre urgência"
}

Severity:
- baixo: problema estético ou que não afeta direção
- medio: precisa resolver em 1-2 semanas
- alto: resolver em até 3 dias
- urgente: NÃO DIRIJA, leve ao mecânico imediatamente"""

USER_PROMPT_TEMPLATE = """Veículo: {brand} {model} {year}, {fuel_type}, {km} km rodados

Problema relatado pela motorista:
{description}

Analise este problema e forneça o diagnóstico completo no formato JSON especificado."""


def analyze_with_groq(vehicle, description: str) -> dict:
    try:
        from groq import Groq

        client = Groq(api_key=settings.GROQ_API_KEY)
        user_message = USER_PROMPT_TEMPLATE.format(
            brand=vehicle.brand,
            model=vehicle.model,
            year=vehicle.year,
            fuel_type=vehicle.get_fuel_type_display(),
            km=vehicle.km_current,
            description=description,
        )
        response = client.chat.completions.create(
            model="meta-llama/llama-4-scout-17b-16e-instruct",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_message},
            ],
            temperature=0.3,
            max_tokens=1024,
            response_format={"type": "json_object"},
        )
        content = response.choices[0].message.content
        return json.loads(content)
    except Exception as exc:
        logger.error("Groq API error: %s", exc)
        return {
            "severity": "medio",
            "problem_summary": "Não foi possível processar o diagnóstico automático.",
            "explanation": "Houve um problema ao consultar a IA. Por favor, descreva o problema a um mecânico de confiança.",
            "recommendations": ["Consulte um mecânico", "Descreva os sintomas com detalhes"],
            "estimated_cost_range": "Indeterminado",
            "can_drive": True,
            "urgency_note": "Monitore o problema.",
            "error": str(exc),
        }
