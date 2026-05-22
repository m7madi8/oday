from pathlib import Path

p = Path("components/Services.tsx")
text = p.read_text(encoding="utf-8")

old_block = """            ))}
          </div>
          </div>
          </div>

          <motion.div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Service stories">"""

new_block = """            ))}
          </motion.div>
          </motion.div>

          <div className="mt-5 flex justify-center gap-2" role="tablist" aria-label="Service stories">"""

if old_block not in text:
    raise SystemExit("block not found")

text = text.replace(old_block, new_block, 1)

text = text.replace(
    """            ))}
          </motion.div>
        </ScrollReveal>

        {/* Desktop: panoramic accordion strip */}""",
    """            ))}
          </motion.div>
        </ScrollReveal>

        {/* Desktop: panoramic accordion strip */}""",
    1,
)

p.write_text(text, encoding="utf-8")
print("tags ok")
