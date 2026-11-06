import os
from bs4 import BeautifulSoup

def test_index_html_exists():
    assert os.path.exists("index.html"), "index.html does not exist"

def test_index_html_content():
    with open("index.html", "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, "html.parser")

    # Check title
    assert soup.title.string == "Nora Gjøen-Gjøsæter | Foredragsholder og KI-leder"

    # Check main header
    h1 = soup.find("h1")
    assert h1 is not None
    assert "Gjøen\u2011Gjøsæter" in h1.text

    # Check for dark theme default
    body = soup.find("body")
    assert "dark-theme" in body.get("class", [])

    # Check sections exist
    sections = soup.find_all("section")
    assert len(sections) >= 4  # Hero-split, Temaer, Scener, Bakgrunn, Booking

    # Check for hero image
    img = soup.find("img", class_="hero-photo")
    assert img is not None
    assert img["src"] == "images/personer/nora/forside2_web.jpg"

    # Check we have the topic cards
    topic_cards = soup.find_all(class_="topic-card")
    assert len(topic_cards) >= 3

    # Check we have the advisory/dev section cards
    verv_items = soup.find_all("div", class_="service-card")
    assert len(verv_items) >= 2

    # Check for the about-section speaker photo
    about_photo = soup.find("img", class_="about-photo")
    assert about_photo is not None

    # Check the contact section links directly to email (no form)
    assert soup.find("form") is None
    contact = soup.find("section", id="kontakt")
    assert contact is not None
    assert contact.find("a", href="mailto:nora@kantega.no") is not None

    # Check JS link
    js_script = soup.find("script", src="script.js")
    assert js_script is not None

def test_speaker_promo_video():
    with open("index.html", "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")

    foredrag = soup.find("section", id="foredrag")
    video = foredrag.find("video")
    assert video is not None
    assert video["poster"] == "images/foredrag-promo-poster.jpg"
    assert os.path.exists(video["poster"])
    src = video.find("source")["src"]
    assert src == "videos/foredrag-promo.mp4"
    assert os.path.exists(src)


def test_agent_profile_files_exist():
    for path in ("llms.txt", "llms-full.txt", "nora.json", "for-agenter/index.html",
                 "for-agenter/agent.css", "for-agenter/agent.js"):
        assert os.path.exists(path), f"{path} mangler"


def test_main_page_links_agent_files():
    with open("index.html", "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
    hrefs = {link.get("href") for link in soup.find_all("link", rel="alternate")}
    assert {"llms.txt", "nora.json", "for-agenter/index.html"} <= hrefs


def test_nora_json_structure():
    import json
    with open("nora.json", "r", encoding="utf-8") as f:
        data = json.load(f)
    assert data["@type"] == "Person"
    assert data["email"] == "mailto:nora@kantega.no"
    assert "nora.gjoen-gjoseter" not in json.dumps(data)
    for key in ("skillCategories", "projects", "talks", "positions", "alumniOf"):
        assert data[key], f"{key} er tom"
    assert len(data["projects"]) >= 17
    assert "Python" in data["skillCategories"]["Programmeringsspråk"]


def test_agent_page_structure():
    with open("for-agenter/index.html", "r", encoding="utf-8") as f:
        soup = BeautifulSoup(f.read(), "html.parser")
    robots = soup.find("meta", attrs={"name": "robots"})
    assert robots is not None and "noindex" in robots["content"]
    ids = {s.get("id") for s in soup.find_all("section")}
    assert {"sammendrag", "ledelse", "teknisk", "ferdigheter", "prosjekter",
            "foredrag", "verv", "kontakt"} <= ids
    assert soup.find("script", type="application/ld+json") is not None
    assert soup.find("a", href="mailto:nora@kantega.no") is not None
    assert "nora.gjoen-gjoseter" not in str(soup)
    tags = soup.select("#ferdigheter .tags li")
    assert len(tags) >= 200
    assert len(soup.select("#prosjekter .project")) >= 17


def test_llms_txt_content():
    with open("llms.txt", "r", encoding="utf-8") as f:
        text = f.read()
    assert text.startswith("# Nora Gjøen-Gjøsæter")
    assert "nora@kantega.no" in text
    assert "nora.json" in text and "llms-full.txt" in text
