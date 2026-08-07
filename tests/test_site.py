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

    # Check for speaker image
    img = soup.find("img", class_="hero-photo")
    assert img is not None
    assert img["src"] == "images/speaker.jpeg"

    # Check we have the topic cards
    topic_cards = soup.find_all(class_="topic-card")
    assert len(topic_cards) >= 3

    # Check we have the advisory/dev section cards
    verv_items = soup.find_all("div", class_="service-card")
    assert len(verv_items) >= 2

    # Check for extra image
    vestland_img = soup.find("img", src="images/vestland26.png")
    assert vestland_img is not None

    # Check the contact section links directly to email (no form)
    assert soup.find("form") is None
    contact = soup.find("section", id="kontakt")
    assert contact is not None
    assert contact.find("a", href="mailto:nora@kantega.no") is not None

    # Check JS link
    js_script = soup.find("script", src="script.js")
    assert js_script is not None