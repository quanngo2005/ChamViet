from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

_model = None

def get_model():
    global _model
    if _model is None:
        print("⏳ Load SBERT model...")
        _model = SentenceTransformer("keepitreal/vietnamese-sbert")
        print("✅ SBERT ready!")
    return _model

def match_best_answer(user_text: str, answers: dict, threshold: float = 0.6) -> tuple:
    model      = get_model()
    keys       = list(answers.keys())
    all_texts  = [user_text] + [answers[k] for k in keys]
    embeddings = model.encode(all_texts)
    user_emb   = embeddings[0]

    best_key   = None
    best_score = 0.0

    for i, key in enumerate(keys):
        score = float(cosine_similarity([user_emb], [embeddings[i + 1]])[0][0])
        print(f"    {key}: {score:.0%} — {answers[key][:50]}")
        if score > best_score:
            best_score = score
            best_key   = key

    if best_score >= threshold:
        print(f"  ✅ Match: {best_key} ({best_score:.0%})")
        return best_key, best_score

    print(f"  ❓ Không khớp đủ (max {best_score:.0%})")
    return None, best_score
