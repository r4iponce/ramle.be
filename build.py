import os
import shutil

import sass
import yaml
from jinja2 import Environment, FileSystemLoader


def prepare() -> None:
    if os.path.exists("output") and os.path.isdir("output"):
        shutil.rmtree("output")
    os.mkdir("output")
    os.mkdir("output/static/")
    os.mkdir("output/static/css")


def compile_sass() -> None:
    sass.compile(dirname=('static/sass',
                          'output/static/css'), output_style='compressed')


def render_all() -> None:
    with open("./data.yml", 'r', encoding="utf-8") as data:
        try:
            data = yaml.safe_load(data)
            env = Environment(loader=FileSystemLoader('templates/'))

            template = env.get_template("index.html")
            rendered_template = template.render(data)
            with open("output/index.html", "a", encoding="utf-8") as file:
                file.write(rendered_template)

            print("🤩 Rendered site")
        except yaml.YAMLError as exc:
            print("😢 Unable to load data file", exc)


def copy_assets():
    shutil.copytree("static/fonts", "output/static/fonts")
    shutil.copytree("static/js", "output/static/js")
    shutil.copytree("static/misc", "output/static/misc")


def main() -> None:
    prepare()
    render_all()
    compile_sass()
    copy_assets()


if __name__ == "__main__":
    main()
