#!/usr/bin/env bash

cat >label.tex <<'EOF'
\documentclass{ltjsarticle}

\usepackage[margin=10truemm]{geometry}

\usepackage{ltablex}
\usepackage{graphicx}
\usepackage{tabularx}

\pagestyle{empty}

\begin{document}

\centering
\setlongtables
\begin{tabularx}{10cm}{|lX|} \hline
EOF

for id in $(tail +2 ../Package.csv | cut -d, -f1); do
    qrencode -o "${id}.png" -- "${id}"
    (
        echo "\\includegraphics[width=2cm]{${id}.png} & \\texttt{${id}} \\\\ \\hline"
        echo "\\includegraphics[width=2cm]{${id}.png} & \\texttt{${id}} \\\\ \\hline"
    ) >>label.tex
done

cat >>label.tex <<'EOF'
\end{tabularx}

\end{document}
EOF
