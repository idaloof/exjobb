#!/bin/bash

# Check if at least two arguments are provided
if [ $# -lt 3 ]; then
    echo "Usage: $0 <input_file> <TYPE_value> <output_file>"
    echo "Ex. category.csv ACTED_IN updated-category.csv"
    exit 1
fi

# File name
filename="$1"
listed_in_value="$2"
output_filename="$3"

# Check if the file exists
if [ ! -f "$filename" ]; then
    echo "File '$filename' does not exist."
    exit 1
fi

# Read the first line separately and append ",:TYPE" and write to new file
head -n 1 "$filename" | sed "s/$/,:TYPE/" > "$output_filename"

# Add ",<TYPE_value>" to each line except the first one
tail -n +2 "$filename" | awk -v listed_in="$listed_in_value" '{print $0 ",\"" listed_in "\""}' >> "$output_filename"
