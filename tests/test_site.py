import subprocess
import unittest
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import urlsplit


ROOT = Path(__file__).resolve().parents[1]
INDEX = ROOT / "index.html"
SCRIPT_FILES = (ROOT / "assets/js/config.js", ROOT / "assets/js/app.js")


class SiteParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.ids = []
        self.links = []
        self.metas = []
        self.scripts = []
        self.title_parts = []
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
            self.scripts.append(attributes)
        if tag == "title":
            self._in_title = True

    def handle_endtag(self, tag):
        if tag == "title":
            self._in_title = False

    def handle_data(self, data):
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
        local_targets = [
            attributes.get("href", "")
            for _, attributes in self.parser.links
        ] + [
            attributes.get("src", "")
            for attributes in self.parser.scripts
        ]
        for href in local_targets:
            parsed = urlsplit(href)
            if not href or parsed.scheme or href.startswith(('#', 'mailto:')):
                continue
            target = ROOT / parsed.path.lstrip("/")
            if not target.exists():
                missing.append(href)
        self.assertEqual(missing, [])

    def test_javascript_is_external_and_inline_handlers_are_absent(self):
        self.assertNotIn("<script>", self.source)
        for attribute in (
            "onclick=",
            "onkeydown=",
            "onload=",
            "oninput=",
            "onchange=",
            "onsubmit=",
        ):
            self.assertNotIn(attribute, self.source)

    def test_new_tab_links_are_isolated(self):
        literal_targets = self.source.count('target="_blank"')
        isolated_targets = self.source.count(
            'target="_blank" rel="noopener noreferrer"'
        )
        self.assertEqual(literal_targets, isolated_targets)
        app_source = SCRIPT_FILES[1].read_text(encoding="utf-8")
        self.assertIn("a.rel = 'noopener noreferrer'", app_source)
        self.assertIn("pill.rel = 'noopener noreferrer'", app_source)

    def test_certification_badges_have_public_verification_links(self):
        expected_urls = (
            "https://www.credly.com/badges/4cd4353a-9b80-46cd-9633-6bc1e5f6aba7/public_url",
            "https://www.credly.com/badges/a7bf62aa-9299-4e7c-9856-4e01135675b3/public_url",
        )
        for url in expected_urls:
            self.assertIn(url, SCRIPT_FILES[0].read_text(encoding="utf-8"))
        self.assertIn(
            "document.createElement(c.url ? 'a' : 'span')",
            SCRIPT_FILES[1].read_text(encoding="utf-8"),
        )

    def test_swisscheese_pay_is_featured(self):
        config_source = SCRIPT_FILES[0].read_text(encoding="utf-8")
        project_index = config_source.index("title: 'SwissCheese Pay'")
        existing_project_index = config_source.index("title: 'Local Hoops Knicks Map'")

        self.assertLess(project_index, existing_project_index)
        self.assertIn(
            "https://github.com/ericfurspan/swisscheese-pay",
            config_source,
        )
        self.assertIn(
            "outcome: 'Exploit, fix, and detection for nine vulnerabilities'",
            config_source,
        )

    def test_javascript_files_parse(self):
        for script in SCRIPT_FILES:
            result = subprocess.run(
                ["node", "--check", str(script)],
                text=True,
                capture_output=True,
                check=False,
            )
            self.assertEqual(result.returncode, 0, result.stderr)

    def test_responsive_height_recalculation_is_wired(self):
        app_source = SCRIPT_FILES[1].read_text(encoding="utf-8")
        css_source = (ROOT / "assets/css/site.css").read_text(encoding="utf-8")
        self.assertIn("document.fonts?.ready.then(snapCardHeight)", app_source)
        self.assertIn("window.addEventListener('resize'", app_source)
        self.assertIn("@media (max-height: 560px)", css_source)


if __name__ == "__main__":
    unittest.main()
