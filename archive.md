---
layout: page
title: Archive
kicker: Everything, By Year
---

<div class="arch-search reveal">
  <input id="archSearch" type="text" placeholder="Search essays by title or theme…" autocomplete="off" aria-label="Search essays">
</div>

{%- assign posts = site.pages | where_exp: "p", "p.layout == 'post'" | sort: "date" | reverse -%}
<div class="arch-list reveal">
{%- assign current_year = "" -%}
{%- for post in posts -%}
  {%- assign y = post.date | date: "%Y" -%}
  {%- if y != current_year -%}
<div class="arch-year">{{ y }}</div>
    {%- assign current_year = y -%}
  {%- endif -%}
  {%- capture search -%}{{ post.title }} {{ post.subtitle }} {{ post.category }} {{ post.excerpt }}{%- endcapture -%}
<a class="arch-row" data-search="{{ search | strip_html | downcase | escape }}" href="{{ post.url | relative_url }}">
  <div class="ar-date">{{ post.date | date: "%b %d, %Y" }}</div>
  <div class="ar-main">
    <div class="ar-title">{{ post.title }}</div>
    {%- if post.subtitle %}<div class="ar-sub">{{ post.subtitle }}</div>{% endif -%}
  </div>
</a>
{%- endfor -%}
</div>
<div id="archEmpty">No essays match that search.</div>
