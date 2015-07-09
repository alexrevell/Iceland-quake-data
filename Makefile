all: data/icelandBoundaries.json

.PHONY: all

data/world10m.zip:
	mkdir -p $(dir $@)
	curl -L -o $@ http://www.naturalearthdata.com/http//www.naturalearthdata.com/download/10m/cultural/ne_10m_admin_0_map_subunits.zip

data/ne_10m_admin_0_map_subunits.shp: data/world10m.zip
	unzip -od $(dir $@) $<
	touch data/ne_10m_admin_0_map_subunits.shp

data/icelandBoundaries.json: data/ne_10m_admin_0_map_subunits.shp
	ogr2ogr -f GeoJSON -where "ADM0_A3 IN ('ISL')" data/ISLGEOJSON.json data/ne_10m_admin_0_map_subunits.shp
	topojson -o data/icelandBoundaries.json -- data/ISLGEOJSON.json
