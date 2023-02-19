label.pdf: label.tex
	lualatex $<

label.tex: ../Package.csv generate_label.sh
	./generate_label.sh

.PHONY: clean
clean:
	$(RM) *.png *.aux *.log *.pdf *.tex
