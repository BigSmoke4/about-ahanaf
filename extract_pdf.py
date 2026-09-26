from pypdf import PdfReader

# Read the PDF file
pdf_file = "Ahanaf_Mokammel_Omi_Curriculum_Vitae.pdf"
reader = PdfReader(pdf_file)

# Extract text from all pages
full_text = ""
for page in reader.pages:
    full_text += page.extract_text() + "\n"

# Save to a text file
with open("resume_content.txt", "w", encoding="utf-8") as f:
    f.write(full_text)

print("PDF content extracted to resume_content.txt")
print("\n--- First 500 characters ---")
print(full_text[:500])
