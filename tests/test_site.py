import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
TARGET = "https://github.com/ericfurspan"


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.links = []
        self.metas = []
        self.scripts = 0

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if tag in {"a", "link"}:
            self.links.append((tag, attributes))
        if tag == "meta":
            self.metas.append(attributes)
        if tag == "script":
            self.scripts += 1


class RedirectTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.parser = SiteParser()
        cls.parser.feed(INDEX.read_text(encoding="utf-8"))
        cls.parser.close()

    def test_refresh_points_at_github_profile(self):
        refresh = [
            meta.get("content", "")
            for meta in self.parser.metas
            if meta.get("http-equiv", "").lower() == "refresh"
        ]
        self.assertEqual(refresh, [f"0; url={TARGET}"])

    def test_canonical_and_fallback_link_point_at_github_profile(self):
        canonical = [
            attributes.get("href")
            for tag, attributes in self.parser.links
            if tag == "link" and attributes.get("rel") == "canonical"
        ]
        anchors = [attributes.get("href") for tag, attributes in self.parser.links if tag == "a"]
        self.assertEqual(canonical, [TARGET])
        self.assertEqual(anchors, [TARGET])

    def test_page_is_not_indexed_and_runs_no_scripts(self):
        robots = [meta.get("content") for meta in self.parser.metas if meta.get("name") == "robots"]
        self.assertEqual(robots, ["noindex"])
        self.assertEqual(self.parser.scripts, 0)

    def test_local_link_targets_exist(self):
        missing = []
        for _, attributes in self.parser.links:
            href = attributes.get("href", "")
            if not href or urlsplit(href).scheme:
                continue
            if not (ROOT / urlsplit(href).path.lstrip("/")).exists():
                missing.append(href)
        self.assertEqual(missing, [])


if __name__ == "__main__":
    unittest.main()
