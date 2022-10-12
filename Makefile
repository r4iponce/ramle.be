all: clean build
build:
	python3 build.py
	minify-html output/**/*.html

clean:
	rm -rf output/