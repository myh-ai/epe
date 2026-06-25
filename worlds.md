---
layout: page
title: Worlds
kicker: The Constellations
---

<p class="worlds-intro reveal">The essays gather into six recurring rooms — the worlds this blog keeps orbiting. Each carries a few finer threads. Wander into whichever one calls you.</p>

{%- assign allposts = site.pages | where_exp: "p", "p.layout == 'post'" | sort: "date" | reverse -%}
{% for w in site.data.worlds %}
  {%- assign wcount = 0 -%}
  {%- for p in allposts -%}
    {%- assign hit = false -%}
    {%- for t in w.tags -%}{%- if p.worlds contains t -%}{%- assign hit = true -%}{%- break -%}{%- endif -%}{%- endfor -%}
    {%- if hit -%}{%- assign wcount = wcount | plus: 1 -%}{%- endif -%}
  {%- endfor -%}
  {%- if wcount > 0 -%}
<section class="world reveal" id="{{ w.slug }}">
  <div class="sec-head"><span class="lbl">{{ w.title }}</span><span class="line"></span><span class="world-count">{{ wcount }}{% if wcount == 1 %} essay{% else %} essays{% endif %}</span></div>
  <p class="world-blurb">{{ w.blurb }}</p>
  <div class="grid">
    {%- assign i = 0 -%}
    {%- for p in allposts -%}
      {%- assign hit = false -%}
      {%- for t in w.tags -%}{%- if p.worlds contains t -%}{%- assign hit = true -%}{%- break -%}{%- endif -%}{%- endfor -%}
      {%- if hit -%}{% include card.html post=p index=i %}{%- assign i = i | plus: 1 -%}{%- endif -%}
    {%- endfor -%}
  </div>
</section>
  {%- endif -%}
{% endfor %}
