import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.metas = []
        self.scripts = []
        self.title_parts = []
        self._in_script = False
        self._in_title = False

    def handle_starttag(self, tag, attrs):
        attributes = dict(attrs)
        if "id" in attributes:
            self.ids.append(attributes["id"])
        if tag in {"a", "link"}:
            self.links.append((tag, attributes))
        if tag == "meta":
            self.metas.append(attributes)
        if tag == "script":
            self._in_script = True
        if tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "script":
            self._in_script = False
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
        if self._in_script:
            self.scripts.append(data)
        if self._in_title:
            self.title_parts.append(data)


class SiteSmokeTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.source = INDEX.read_text(encoding="utf-8")
        cls.parser = SiteParser()
        cls.parser.feed(cls.source)
        cls.parser.close()

    def test_page_has_complete_metadata(self):
        title = "".join(self.parser.title_parts).strip()
        self.assertEqual(title, "Eric Furspan — Software Engineer")

        keyed_meta = {
            meta.get("name") or meta.get("property"): meta.get("content")
            for meta in self.parser.metas
            if meta.get("name") or meta.get("property")
        }
        for key in (
            "description",
            "og:title",
            "og:description",
            "og:url",
            "og:type",
            "twitter:card",
            "twitter:title",
            "twitter:description",
        ):
            self.assertTrue(keyed_meta.get(key), f"Missing metadata: {key}")

    def test_ids_are_unique(self):
        duplicates = {value for value in self.parser.ids if self.parser.ids.count(value) > 1}
        self.assertEqual(duplicates, set())

    def test_local_link_targets_exist(self):
        missing = []
        for _, attributes in self.parser.links:
            href = attributes.get("href", "")
            parsed = urlsplit(href)
            if not href or parsed.scheme or href.startswith(('#', 'mailto:')):
                continue
            target = ROOT / parsed.path.lstrip("/")
            if not target.exists():
                missing.append(href)
        self.assertEqual(missing, [])

    def test_new_tab_links_are_isolated(self):
        literal_targets = self.source.count('target="_blank"')
        isolated_targets = self.source.count(
            'target="_blank" rel="noopener noreferrer"'
        )
        self.assertEqual(literal_targets, isolated_targets)
        self.assertIn("a.rel = 'noopener noreferrer'", self.source)
        self.assertIn("pill.rel = 'noopener noreferrer'", self.source)

    def test_certification_badges_have_public_verification_links(self):
        expected_urls = (
            "https://www.credly.com/badges/4cd4353a-9b80-46cd-9633-6bc1e5f6aba7/public_url",
            "https://www.credly.com/badges/a7bf62aa-9299-4e7c-9856-4e01135675b3/public_url",
        )
        for url in expected_urls:
            self.assertIn(url, self.source)
        self.assertIn("document.createElement(c.url ? 'a' : 'span')", self.source)

    def test_swisscheese_pay_is_featured(self):
        project_index = self.source.index("title: 'SwissCheese Pay'")
        existing_project_index = self.source.index("title: 'Local Hoops Knicks Map'")

        self.assertLess(project_index, existing_project_index)
        self.assertIn(
            "https://github.com/ericfurspan/swisscheese-pay",
            self.source,
        )
        self.assertIn(
            "outcome: 'Exploit, fix, and detection for nine vulnerabilities'",
            self.source,
        )

    def test_inline_javascript_parses(self):
        result = subprocess.run(
            ["node", "--check"],
            input="\n".join(self.parser.scripts),
            text=True,
            capture_output=True,
            check=False,
        )
        self.assertEqual(result.returncode, 0, result.stderr)

    def test_responsive_height_recalculation_is_wired(self):
        self.assertIn("document.fonts?.ready.then(snapCardHeight)", self.source)
        self.assertIn("window.addEventListener('resize'", self.source)
        self.assertIn("@media (max-height: 560px)", self.source)


if __name__ == "__main__":
    unittest.main()
