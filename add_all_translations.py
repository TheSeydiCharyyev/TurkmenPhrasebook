#!/usr/bin/env python3
"""
Автоматическое добавление всех переводов Visual Translator
"""
import re

# Все переводы для всех языков (продолжение)
TRANSLATIONS_BLOCK = """
    // Visual Translator - Home Screen
    vtTranslateWithAI: '{vtTranslateWithAI}',
    vtCameraSubtitle: '{vtCameraSubtitle}',
    vtTakePhoto: '{vtTakePhoto}',
    vtChooseGallery: '{vtChooseGallery}',
    vtProcessing: '{vtProcessing}',
    vtProcessingSubtext: '{vtProcessingSubtext}',
    vtOcrEngine: '{vtOcrEngine}',
    vtFeatures: '{vtFeatures}',
    vtFeatureOcrTitle: '{vtFeatureOcrTitle}',
    vtFeatureOcrDesc: '{vtFeatureOcrDesc}',
    vtFeatureAiTitle: '{vtFeatureAiTitle}',
    vtFeatureAiDesc: '{vtFeatureAiDesc}',
    vtFeatureSmartTitle: '{vtFeatureSmartTitle}',
    vtFeatureSmartDesc: '{vtFeatureSmartDesc}',
    vtFeatureSaveTitle: '{vtFeatureSaveTitle}',
    vtFeatureSaveDesc: '{vtFeatureSaveDesc}',
    vtPermissionsText: '{vtPermissionsText}',
    vtGrantPermissions: '{vtGrantPermissions}',
    vtRequestingPermissions: '{vtRequestingPermissions}',
    vtAutoFallback: '{vtAutoFallback}',

    // Visual Translator - Result Screen
    vtResult: '{vtResult}',
    vtRecognizedText: '{vtRecognizedText}',
    vtLanguageLabel: '{vtLanguageLabel}',
    vtAiAnalysis: '{vtAiAnalysis}',
    vtTranslation: '{vtTranslation}',
    vtTargetLabel: '{vtTargetLabel}',
    vtPlay: '{vtPlay}',
    vtStop: '{vtStop}',
    vtCopy: '{vtCopy}',
    vtTranslateAnother: '{vtTranslateAnother}',
    vtCopied: '{vtCopied}',
    vtCopiedMessage: '{vtCopiedMessage}',
"""

TRANSLATIONS = {
    'es': {
        'vtTranslateWithAI': 'Traducir con IA',
        'vtCameraSubtitle': 'Apunta tu cámara a cualquier texto para obtener traducción instantánea',
        'vtTakePhoto': 'Tomar foto',
        'vtChooseGallery': 'Elegir de la galería',
        'vtProcessing': 'Procesando imagen...',
        'vtProcessingSubtext': 'Reconociendo y traduciendo texto',
        'vtOcrEngine': 'Motor OCR',
        'vtFeatures': 'Características',
        'vtFeatureOcrTitle': 'Reconocimiento de texto OCR',
        'vtFeatureOcrDesc': 'Reconoce texto en 30+ idiomas con alta precisión',
        'vtFeatureAiTitle': 'Descripción de objetos con IA',
        'vtFeatureAiDesc': 'Describe objetos cuando no se encuentra texto',
        'vtFeatureSmartTitle': 'Traducción inteligente',
        'vtFeatureSmartDesc': 'Traducción contextual impulsada por IA',
        'vtFeatureSaveTitle': 'Guardar y compartir',
        'vtFeatureSaveDesc': 'Guarda traducciones en favoritos y compártelas',
        'vtPermissionsText': 'Se requieren permisos de cámara y galería de fotos',
        'vtGrantPermissions': 'Conceder permisos',
        'vtRequestingPermissions': 'Solicitando permisos...',
        'vtAutoFallback': 'Reserva automática activada si falla el motor seleccionado',
        'vtResult': 'Resultado',
        'vtRecognizedText': 'Texto reconocido',
        'vtLanguageLabel': 'Idioma: ',
        'vtAiAnalysis': 'Análisis IA',
        'vtTranslation': 'Traducción',
        'vtTargetLabel': 'Objetivo: ',
        'vtPlay': 'Reproducir',
        'vtStop': 'Detener',
        'vtCopy': 'Copiar',
        'vtTranslateAnother': 'Traducir otro',
        'vtCopied': 'Copiado',
        'vtCopiedMessage': 'Traducción copiada al portapapeles',
    },
    # Добавить остальные языки...
}

# Read file
with open('src/contexts/LanguageContext.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# For each language, insert translations before the closing brace
for lang_code, translations in TRANSLATIONS.items():
    # Format the translation block
    trans_block = TRANSLATIONS_BLOCK.format(**translations)

    # Find the pattern: success: 'xxx',\n  },\n\n  next_lang:
    pattern = rf"(  {lang_code}: \{{.*?success: '[^']+',)\n(  \}},)"

    def replacer(match):
        return match.group(1) + trans_block + '\n' + match.group(2)

    content = re.sub(pattern, replacer, content, flags=re.DOTALL)

# Write back
with open('src/contexts/LanguageContext.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Added translations for: {list(TRANSLATIONS.keys())}")
