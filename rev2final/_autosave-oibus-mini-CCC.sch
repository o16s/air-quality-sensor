(kicad_sch
	(version 20231120)
	(generator "eeschema")
	(generator_version "8.0")
	(uuid "1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1")
	(paper "A3")
	(title_block
		(title "Air Quality Sensor Board for Climate City Cup")
		(date "2019-04-03")
		(rev "1")
		(company "Octanis Instruments OÜ")
		(comment 2 "https://ohwr.org/project/licenses/wikis/cern-ohl-v1.2")
		(comment 3 "Licensed under CERN OHL v1.2")
	)
	(lib_symbols
		(symbol "DW01:DW01"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -6.35 6.35 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "DW01"
				(at 5.08 -6.35 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" "Package_SON:WSON-6_1.5x1.5mm_P0.5mm"
				(at -2.54 12.7 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "https://datasheet.lcsc.com/szlcsc/1810081612_Fortune-Semicon-DW01C-G_C35306.pdf"
				(at -6.35 5.08 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Battery Protection ICs SOT-23-6 Rohs for Single-Cell Li-Ion Battery"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "protection Li-Ion Li-Pol"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "SOT*23*6"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "DW01_0_1"
				(rectangle
					(start -7.62 5.08)
					(end 7.62 -5.08)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "DW01_1_1"
				(pin output line
					(at 10.16 -2.54 180)
					(length 2.54)
					(name "OD"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -10.16 -2.54 0)
					(length 2.54)
					(name "CS"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin output line
					(at 10.16 2.54 180)
					(length 2.54)
					(name "OC"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at 0 7.62 270)
					(length 2.54)
					(name "TD"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -10.16 2.54 0)
					(length 2.54)
					(name "VCC"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 -7.62 90)
					(length 2.54)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:Battery_Cell"
			(pin_numbers hide)
			(pin_names
				(offset 0) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "BT"
				(at 2.54 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Battery_Cell"
				(at 2.54 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 0 1.524 90)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 1.524 90)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Single-cell battery"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "battery cell"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Battery_Cell_0_1"
				(rectangle
					(start -2.286 1.778)
					(end 2.286 1.524)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(rectangle
					(start -1.524 1.016)
					(end 1.524 0.508)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(polyline
					(pts
						(xy 0 0.762) (xy 0 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 1.778) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 3.048) (xy 1.778 3.048)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 3.556) (xy 1.27 2.54)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "Battery_Cell_1_1"
				(pin passive line
					(at 0 5.08 270)
					(length 2.54)
					(name "+"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -2.54 90)
					(length 2.54)
					(name "-"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:C"
			(pin_numbers hide)
			(pin_names
				(offset 0.254)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "C"
				(at 0.635 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "C"
				(at 0.635 -2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 0.9652 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Unpolarized capacitor"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "cap capacitor"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "C_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "C_0_1"
				(polyline
					(pts
						(xy -2.032 -0.762) (xy 2.032 -0.762)
					)
					(stroke
						(width 0.508)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.032 0.762) (xy 2.032 0.762)
					)
					(stroke
						(width 0.508)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "C_1_1"
				(pin passive line
					(at 0 3.81 270)
					(length 2.794)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -3.81 90)
					(length 2.794)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:C_Small"
			(pin_numbers hide)
			(pin_names
				(offset 0.254) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "C"
				(at 0.254 1.778 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "C_Small"
				(at 0.254 -2.032 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Unpolarized capacitor, small symbol"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "capacitor cap"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "C_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "C_Small_0_1"
				(polyline
					(pts
						(xy -1.524 -0.508) (xy 1.524 -0.508)
					)
					(stroke
						(width 0.3302)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.524 0.508) (xy 1.524 0.508)
					)
					(stroke
						(width 0.3048)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "C_Small_1_1"
				(pin passive line
					(at 0 2.54 270)
					(length 2.032)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -2.54 90)
					(length 2.032)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:Crystal"
			(pin_numbers hide)
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "Y"
				(at 0 3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "Crystal"
				(at 0 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Two pin crystal"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "quartz ceramic resonator oscillator"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "Crystal*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Crystal_0_1"
				(rectangle
					(start -1.143 2.54)
					(end 1.143 -2.54)
					(stroke
						(width 0.3048)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.54 0) (xy -1.905 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.905 -1.27) (xy -1.905 1.27)
					)
					(stroke
						(width 0.508)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.905 -1.27) (xy 1.905 1.27)
					)
					(stroke
						(width 0.508)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 0) (xy 1.905 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "Crystal_1_1"
				(pin passive line
					(at -3.81 0 0)
					(length 1.27)
					(name "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 3.81 0 180)
					(length 1.27)
					(name "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:D_Schottky"
			(pin_numbers hide)
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "D"
				(at 0 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "D_Schottky"
				(at 0 -2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Schottky diode"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "diode Schottky"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "TO-???* *_Diode_* *SingleDiode* D_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "D_Schottky_0_1"
				(polyline
					(pts
						(xy 1.27 0) (xy -1.27 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 1.27) (xy 1.27 -1.27) (xy -1.27 0) (xy 1.27 1.27)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.905 0.635) (xy -1.905 1.27) (xy -1.27 1.27) (xy -1.27 -1.27) (xy -0.635 -1.27) (xy -0.635 -0.635)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "D_Schottky_1_1"
				(pin passive line
					(at -3.81 0 0)
					(length 2.54)
					(name "K"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 3.81 0 180)
					(length 2.54)
					(name "A"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:L"
			(pin_numbers hide)
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "L"
				(at -1.27 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "L"
				(at 1.905 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Inductor"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "inductor choke coil reactor magnetic"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "Choke_* *Coil* Inductor_* L_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "L_0_1"
				(arc
					(start 0 -2.54)
					(mid 0.6323 -1.905)
					(end 0 -1.27)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 0 -1.27)
					(mid 0.6323 -0.635)
					(end 0 0)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 0 0)
					(mid 0.6323 0.635)
					(end 0 1.27)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 0 1.27)
					(mid 0.6323 1.905)
					(end 0 2.54)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "L_1_1"
				(pin passive line
					(at 0 3.81 270)
					(length 1.27)
					(name "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -3.81 90)
					(length 1.27)
					(name "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:LED"
			(pin_numbers hide)
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "D"
				(at 0 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "LED"
				(at 0 -2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Light emitting diode"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "LED diode"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "LED* LED_SMD:* LED_THT:*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "LED_0_1"
				(polyline
					(pts
						(xy -1.27 -1.27) (xy -1.27 1.27)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 0) (xy 1.27 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 -1.27) (xy 1.27 1.27) (xy -1.27 0) (xy 1.27 -1.27)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -3.048 -0.762) (xy -4.572 -2.286) (xy -3.81 -2.286) (xy -4.572 -2.286) (xy -4.572 -1.524)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.778 -0.762) (xy -3.302 -2.286) (xy -2.54 -2.286) (xy -3.302 -2.286) (xy -3.302 -1.524)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "LED_1_1"
				(pin passive line
					(at -3.81 0 0)
					(length 2.54)
					(name "K"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 3.81 0 180)
					(length 2.54)
					(name "A"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:Q_NMOS_GSD"
			(pin_names
				(offset 0) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "Q"
				(at 5.08 1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Q_NMOS_GSD"
				(at 5.08 -1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 5.08 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "N-MOSFET transistor, gate/source/drain"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "transistor NMOS N-MOS N-MOSFET"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Q_NMOS_GSD_0_1"
				(polyline
					(pts
						(xy 0.254 0) (xy -2.54 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.254 1.905) (xy 0.254 -1.905)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 -1.27) (xy 0.762 -2.286)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 0.508) (xy 0.762 -0.508)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 2.286) (xy 0.762 1.27)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 2.54) (xy 2.54 1.778)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 -2.54) (xy 2.54 0) (xy 0.762 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 -1.778) (xy 3.302 -1.778) (xy 3.302 1.778) (xy 0.762 1.778)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.016 0) (xy 2.032 0.381) (xy 2.032 -0.381) (xy 1.016 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(polyline
					(pts
						(xy 2.794 0.508) (xy 2.921 0.381) (xy 3.683 0.381) (xy 3.81 0.254)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 3.302 0.381) (xy 2.921 -0.254) (xy 3.683 -0.254) (xy 3.302 0.381)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 1.651 0)
					(radius 2.794)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 2.54 -1.778)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(circle
					(center 2.54 1.778)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
			)
			(symbol "Q_NMOS_GSD_1_1"
				(pin input line
					(at -5.08 0 0)
					(length 2.54)
					(name "G"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 2.54 -5.08 90)
					(length 2.54)
					(name "S"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 2.54 5.08 270)
					(length 2.54)
					(name "D"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:Q_PMOS_GSD"
			(pin_names
				(offset 0) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "Q"
				(at 5.08 1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Q_PMOS_GSD"
				(at 5.08 -1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 5.08 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "P-MOSFET transistor, gate/source/drain"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "transistor PMOS P-MOS P-MOSFET"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Q_PMOS_GSD_0_1"
				(polyline
					(pts
						(xy 0.254 0) (xy -2.54 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.254 1.905) (xy 0.254 -1.905)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 -1.27) (xy 0.762 -2.286)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 0.508) (xy 0.762 -0.508)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 2.286) (xy 0.762 1.27)
					)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 2.54) (xy 2.54 1.778)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 -2.54) (xy 2.54 0) (xy 0.762 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.762 1.778) (xy 3.302 1.778) (xy 3.302 -1.778) (xy 0.762 -1.778)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.286 0) (xy 1.27 0.381) (xy 1.27 -0.381) (xy 2.286 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(polyline
					(pts
						(xy 2.794 -0.508) (xy 2.921 -0.381) (xy 3.683 -0.381) (xy 3.81 -0.254)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 3.302 -0.381) (xy 2.921 0.254) (xy 3.683 0.254) (xy 3.302 -0.381)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 1.651 0)
					(radius 2.794)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 2.54 -1.778)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(circle
					(center 2.54 1.778)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
			)
			(symbol "Q_PMOS_GSD_1_1"
				(pin input line
					(at -5.08 0 0)
					(length 2.54)
					(name "G"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 2.54 -5.08 90)
					(length 2.54)
					(name "S"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 2.54 5.08 270)
					(length 2.54)
					(name "D"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:R"
			(pin_numbers hide)
			(pin_names
				(offset 0)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "R"
				(at 2.032 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "R"
				(at 0 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at -1.778 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Resistor"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "R res resistor"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "R_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "R_0_1"
				(rectangle
					(start -1.016 -2.54)
					(end 1.016 2.54)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "R_1_1"
				(pin passive line
					(at 0 3.81 270)
					(length 1.27)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -3.81 90)
					(length 1.27)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Device:R_Small"
			(pin_numbers hide)
			(pin_names
				(offset 0.254) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "R"
				(at 0.762 0.508 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "R_Small"
				(at 0.762 -1.016 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Resistor, small symbol"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "R resistor"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "R_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "R_Small_0_1"
				(rectangle
					(start -0.762 1.778)
					(end 0.762 -1.778)
					(stroke
						(width 0.2032)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "R_Small_1_1"
				(pin passive line
					(at 0 2.54 270)
					(length 0.762)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -2.54 90)
					(length 0.762)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Interface_CAN_LIN:TCAN330"
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -10.16 8.89 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "TCAN330"
				(at 2.54 8.89 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 0 -12.7 0)
				(effects
					(font
						(size 1.27 1.27)
						(italic yes)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "http://www.ti.com/lit/ds/symlink/tcan337.pdf"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "High-Speed CAN Transceiver, 1Mbps, 3.3V supply, silent mode, shutdown mode, SOT-23-8/SOIC-8"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "High-Speed CAN Transceiver"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "*TSOT?23* *SOIC*3.9x4.9mm*P1.27mm*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "TCAN330_0_1"
				(rectangle
					(start -10.16 7.62)
					(end 10.16 -7.62)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "TCAN330_1_1"
				(pin input line
					(at -12.7 5.08 0)
					(length 2.54)
					(name "TXD"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 -10.16 90)
					(length 2.54)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 10.16 270)
					(length 2.54)
					(name "VCC"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin tri_state line
					(at -12.7 2.54 0)
					(length 2.54)
					(name "RXD"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -12.7 -2.54 0)
					(length 2.54)
					(name "SHDN"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 12.7 -2.54 180)
					(length 2.54)
					(name "CANL"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 12.7 2.54 180)
					(length 2.54)
					(name "CANH"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "7"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -12.7 -5.08 0)
					(length 2.54)
					(name "S"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "8"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "Mechanical:Fiducial"
			(exclude_from_sim yes)
			(in_bom no)
			(on_board yes)
			(property "Reference" "FID"
				(at 0 5.08 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "Fiducial"
				(at 0 3.175 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Fiducial Marker"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "fiducial marker"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "Fiducial*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Fiducial_0_1"
				(circle
					(center 0 0)
					(radius 1.27)
					(stroke
						(width 0.508)
						(type default)
					)
					(fill
						(type background)
					)
				)
			)
		)
		(symbol "Mechanical:MountingHole_Pad"
			(pin_numbers hide)
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim yes)
			(in_bom no)
			(on_board yes)
			(property "Reference" "H"
				(at 0 6.35 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "MountingHole_Pad"
				(at 0 4.445 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Mounting Hole with connection"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "mounting hole"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "MountingHole*Pad*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "MountingHole_Pad_0_1"
				(circle
					(center 0 1.27)
					(radius 1.27)
					(stroke
						(width 1.27)
						(type default)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "MountingHole_Pad_1_1"
				(pin input line
					(at 0 -2.54 90)
					(length 2.54)
					(name "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "NINA-B311-00B:NINA-B311-00B"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -22.86 43.18 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
				)
			)
			(property "Value" "NINA-B311-00B"
				(at -22.86 -48.26 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
				)
			)
			(property "Footprint" "XCVR_NINA-B311-00B"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Datasheet" "NINA-B311-00B"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Description" "BLUETOOTH LOW ENERGY MODULE STAN"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field5" "Unavailable"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field6" "None"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field7" "U-Blox America Inc."
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field8" "SMD-55 U-Blox America Inc."
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "ki_locked" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(symbol "NINA-B311-00B_0_0"
				(polyline
					(pts
						(xy -22.86 -45.72) (xy 22.86 -45.72)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -22.86 43.18) (xy -22.86 -45.72)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 22.86 -45.72) (xy 22.86 43.18)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 22.86 43.18) (xy -22.86 43.18)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(pin output line
					(at 27.94 33.02 180)
					(length 5.08)
					(name "RED"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 40.64 180)
					(length 5.08)
					(name "VCC"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "10"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -43.18 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "12"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 10.16 0)
					(length 5.08)
					(name "ANT"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "13"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -43.18 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "14"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin output line
					(at -27.94 25.4 0)
					(length 5.08)
					(name "UART_DTR"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "16"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -27.94 27.94 0)
					(length 5.08)
					(name "UART_DSR"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "17"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at 27.94 25.4 180)
					(length 5.08)
					(name "SWITCH_2"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "18"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -27.94 33.02 0)
					(length 5.08)
					(name "RESET_N"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "19"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -2.54 0)
					(length 5.08)
					(name "IO_2"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin output line
					(at -27.94 20.32 0)
					(length 5.08)
					(name "UART_RTS"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "20"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -27.94 22.86 0)
					(length 5.08)
					(name "UART_CTS"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "21"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin output line
					(at -27.94 15.24 0)
					(length 5.08)
					(name "UART_TXD"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "22"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -27.94 17.78 0)
					(length 5.08)
					(name "UART_RXD"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "23"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -12.7 0)
					(length 5.08)
					(name "IO_24"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "24"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -15.24 0)
					(length 5.08)
					(name "IO_25"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "25"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -43.18 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "26"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -17.78 0)
					(length 5.08)
					(name "IO_27"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "27"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 5.08 0)
					(length 5.08)
					(name "NFC1"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "28"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 2.54 0)
					(length 5.08)
					(name "NFC2"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "29"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -5.08 0)
					(length 5.08)
					(name "IO_3"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -43.18 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "30"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -20.32 0)
					(length 5.08)
					(name "IO_32"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "32"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -22.86 0)
					(length 5.08)
					(name "IO_33"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "33"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -25.4 0)
					(length 5.08)
					(name "IO_34"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "34"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -27.94 0)
					(length 5.08)
					(name "IO_35"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "35"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -30.48 0)
					(length 5.08)
					(name "IO_36"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "36"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -33.02 0)
					(length 5.08)
					(name "IO_37"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "37"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -35.56 0)
					(length 5.08)
					(name "IO_38"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "38"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -35.56 180)
					(length 5.08)
					(name "IO_39"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "39"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -7.62 0)
					(length 5.08)
					(name "IO_4"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -33.02 180)
					(length 5.08)
					(name "IO_40"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "40"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -30.48 180)
					(length 5.08)
					(name "IO_41"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "41"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -27.94 180)
					(length 5.08)
					(name "IO_42"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "42"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -25.4 180)
					(length 5.08)
					(name "IO_43"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "43"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -22.86 180)
					(length 5.08)
					(name "IO_44"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "44"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -20.32 180)
					(length 5.08)
					(name "IO_45"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "45"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -17.78 180)
					(length 5.08)
					(name "IO_46"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "46"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -15.24 180)
					(length 5.08)
					(name "IO_47"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "47"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -12.7 180)
					(length 5.08)
					(name "IO_48"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "48"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -10.16 180)
					(length 5.08)
					(name "IO_49"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "49"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -27.94 -10.16 0)
					(length 5.08)
					(name "IO_5"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -7.62 180)
					(length 5.08)
					(name "IO_50"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "50"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -5.08 180)
					(length 5.08)
					(name "IO_51"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "51"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 -2.54 180)
					(length 5.08)
					(name "IO_52"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "52"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -43.18 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "53"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -43.18 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at 27.94 27.94 180)
					(length 5.08)
					(name "GREEN/SWITCH_1"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "7"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin output line
					(at 27.94 30.48 180)
					(length 5.08)
					(name "BLUE"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "8"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 38.1 180)
					(length 5.08)
					(name "VCC_IO"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "9"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP1"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP10"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP11"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP12"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP2"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP3"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP4"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP5"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP6"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP7"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP8"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 27.94 -40.64 180)
					(length 5.08)
					(name "EP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "EGP9"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
			)
		)
		(symbol "Power_Protection:TPD3E001DRLR"
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -5.08 6.35 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "TPD3E001DRLR"
				(at 8.89 -7.62 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" "Package_TO_SOT_SMD:SOT-553"
				(at -17.78 -7.62 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "http://www.ti.com/lit/ds/symlink/tpd3e001.pdf"
				(at -5.08 6.35 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "TPD3E001 Low-Capacitance 3-Channel ESD-Protection for High-Speed Data Interfaces"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "ESD-Protection"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "SOT?553*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "TPD3E001DRLR_0_1"
				(rectangle
					(start -7.62 5.08)
					(end 7.62 -5.08)
					(stroke
						(width 0.254)
						(type default)
					)
					(fill
						(type background)
					)
				)
				(circle
					(center -5.08 4.572)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(circle
					(center -2.54 -4.572)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(circle
					(center -2.54 2.54)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(circle
					(center -2.54 4.572)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(circle
					(center 0 -4.572)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(polyline
					(pts
						(xy -2.54 2.54) (xy 3.81 2.54)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.54 4.572) (xy -2.54 -4.572)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.032 2.032) (xy -3.048 2.032)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.032 4.064) (xy -3.048 4.064)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 -5.08) (xy 0 4.572)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 0) (xy 3.81 0)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.508 -0.508) (xy -0.508 -0.508)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.508 1.524) (xy -0.508 1.524)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 -2.54) (xy 3.81 -2.54)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 3.048 -3.048) (xy 2.032 -3.048)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 3.048 -1.016) (xy 2.032 -1.016)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -4.318 1.016) (xy -6.096 1.016) (xy -6.096 0.508)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -7.62 0) (xy -7.112 0) (xy -7.112 4.572) (xy -5.08 4.572)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -5.08 1.016) (xy -6.096 -1.016) (xy -4.064 -1.016) (xy -5.08 1.016)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.54 2.032) (xy -3.048 1.016) (xy -2.032 1.016) (xy -2.54 2.032)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.54 4.064) (xy -3.048 3.048) (xy -2.032 3.048) (xy -2.54 4.064)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 -0.508) (xy -0.508 -1.524) (xy 0.508 -1.524) (xy 0 -0.508)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 1.524) (xy -0.508 0.508) (xy 0.508 0.508) (xy 0 1.524)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 -3.048) (xy 2.032 -4.064) (xy 3.048 -4.064) (xy 2.54 -3.048)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 -1.016) (xy 2.032 -2.032) (xy 3.048 -2.032) (xy 2.54 -1.016)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 0 0)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(circle
					(center 0 4.572)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
				(rectangle
					(start 2.54 -4.572)
					(end -5.08 4.572)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 2.54 -2.54)
					(radius 0.254)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type outline)
					)
				)
			)
			(symbol "TPD3E001DRLR_1_1"
				(pin passive line
					(at 10.16 2.54 180)
					(length 2.54)
					(name "IO1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 10.16 0 180)
					(length 2.54)
					(name "IO2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -7.62 90)
					(length 2.54)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 10.16 -2.54 180)
					(length 2.54)
					(name "IO3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at -10.16 0 0)
					(length 2.54)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "SAM-M8Q:SAM-M8Q"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -17.78 18.542 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
				)
			)
			(property "Value" "SAM-M8Q"
				(at -17.78 -20.32 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
				)
			)
			(property "Footprint" "XCVR_SAM-M8Q"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Datasheet" "SAM-M8Q"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Description" "u-Blox M8 Gnss Antenna Module"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field5" "Unavailable"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field6" "None"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field7" "U-Blox America"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field8" "SMD-20 U-Blox America"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "ki_locked" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(symbol "SAM-M8Q_0_0"
				(polyline
					(pts
						(xy -17.78 -17.78) (xy 17.78 -17.78)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -17.78 17.78) (xy -17.78 -17.78)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 17.78 -17.78) (xy 17.78 17.78)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 17.78 17.78) (xy -17.78 17.78)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "10"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "11"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input clock
					(at -22.86 -5.08 0)
					(length 5.08)
					(name "SCL"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "12"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin output line
					(at 22.86 -2.54 180)
					(length 5.08)
					(name "TXD"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "13"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at 22.86 0 180)
					(length 5.08)
					(name "RXD"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "14"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "15"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "16"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 15.24 180)
					(length 5.08)
					(name "VCC"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "17"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -22.86 5.08 0)
					(length 5.08)
					(name "~{RESET_N}"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "18"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -22.86 -10.16 0)
					(length 5.08)
					(name "EXTINT/PIO13"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "19"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 10.16 180)
					(length 5.08)
					(name "VCC_IO"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "20"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 12.7 180)
					(length 5.08)
					(name "V_BCKP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 22.86 -15.24 180)
					(length 5.08)
					(name "GND"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin output line
					(at 22.86 5.08 180)
					(length 5.08)
					(name "TIMEPULSE"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "7"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -22.86 2.54 0)
					(length 5.08)
					(name "SAFEBOOT_N"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "8"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional line
					(at -22.86 -2.54 0)
					(length 5.08)
					(name "SDA"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "9"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
			)
		)
		(symbol "SHT31-DIS-B:SHT31-DIS-B"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -10.16 8.128 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
				)
			)
			(property "Value" "SHT31-DIS-B"
				(at -10.16 -10.16 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
				)
			)
			(property "Footprint" "SON50P250X250X100-9N"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Datasheet" "SHT31 Series 5.5 V 800 µA Surface Mount Humidity and Temperature Sensor"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Description" "Sensirion AG"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field5" "None"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field6" "Unavailable"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field7" "TDFN-8 Sensirion"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "Field8" "SHT31-DIS-B"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left bottom)
					(hide yes)
				)
			)
			(property "ki_locked" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(symbol "SHT31-DIS-B_0_0"
				(polyline
					(pts
						(xy -10.16 -7.62) (xy -10.16 7.62)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -10.16 7.62) (xy 10.16 7.62)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 10.16 -7.62) (xy -10.16 -7.62)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 10.16 7.62) (xy 10.16 -7.62)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(pin bidirectional line
					(at -15.24 -2.54 0)
					(length 5.08)
					(name "SDA"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -15.24 5.08 0)
					(length 5.08)
					(name "ADDR"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin output line
					(at 15.24 2.54 180)
					(length 5.08)
					(name "ALERT"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin bidirectional clock
					(at -15.24 -5.08 0)
					(length 5.08)
					(name "SCL"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 15.24 5.08 180)
					(length 5.08)
					(name "VDD"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin input line
					(at -15.24 2.54 0)
					(length 5.08)
					(name "~{RESET}"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 15.24 -2.54 180)
					(length 5.08)
					(name "R"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "7"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 15.24 -5.08 180)
					(length 5.08)
					(name "VSS"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "8"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
				(pin power_in line
					(at 15.24 0 180)
					(length 5.08)
					(name "EXP"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
					(number "9"
						(effects
							(font
								(size 1.016 1.016)
							)
						)
					)
				)
			)
		)
		(symbol "Switch:SW_Push"
			(pin_numbers hide)
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "SW"
				(at 1.27 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "SW_Push"
				(at 0 -1.524 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 5.08 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 5.08 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "Push button switch, generic, two pins"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "switch normally-open pushbutton push-button"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "SW_Push_0_1"
				(circle
					(center -2.032 0)
					(radius 0.508)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 1.27) (xy 0 3.048)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 2.54 1.27) (xy -2.54 1.27)
					)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 2.032 0)
					(radius 0.508)
					(stroke
						(width 0)
						(type default)
					)
					(fill
						(type none)
					)
				)
				(pin passive line
					(at -5.08 0 0)
					(length 2.54)
					(name "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 5.08 0 180)
					(length 2.54)
					(name "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "led_rgba:LED_BGRA"
			(pin_names
				(offset 0) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "D"
				(at 0 9.398 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "LED_BGRA"
				(at 0 -8.89 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 -1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" "~"
				(at 0 -1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" "RGB LED, blue/green/red/anode"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_keywords" "LED RGB diode"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "LED* LED_SMD:* LED_THT:*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "LED_BGRA_0_0"
				(text "B"
					(at -1.905 3.81 0)
					(effects
						(font
							(size 1.27 1.27)
						)
					)
				)
				(text "G"
					(at -1.905 -1.27 0)
					(effects
						(font
							(size 1.27 1.27)
						)
					)
				)
				(text "R"
					(at -1.905 -6.35 0)
					(effects
						(font
							(size 1.27 1.27)
						)
					)
				)
			)
			(symbol "LED_BGRA_0_1"
				(polyline
					(pts
						(xy -1.27 -5.08) (xy -2.54 -5.08)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 -5.08) (xy 1.27 -5.08)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 -3.81) (xy -1.27 -6.35)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 -3.81) (xy -1.27 -6.35)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 0) (xy -2.54 0)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 0) (xy 1.27 0)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 1.27) (xy -1.27 -1.27)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 5.08) (xy -2.54 5.08)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 6.35) (xy -1.27 3.81)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 0) (xy 2.54 0)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 5.08) (xy -1.27 5.08)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 1.27) (xy -1.27 -1.27) (xy -1.27 -1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 6.35) (xy -1.27 3.81) (xy -1.27 3.81)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 -5.08) (xy 2.032 -5.08) (xy 2.032 5.08) (xy 1.27 5.08)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 -3.81) (xy 1.27 -6.35) (xy -1.27 -5.08) (xy 1.27 -3.81)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 1.27) (xy 1.27 -1.27) (xy -1.27 0) (xy 1.27 1.27)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 6.35) (xy 1.27 3.81) (xy -1.27 5.08) (xy 1.27 6.35)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.016 -3.81) (xy 0.508 -2.286) (xy -0.254 -2.286) (xy 0.508 -2.286) (xy 0.508 -3.048)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.016 1.27) (xy 0.508 2.794) (xy -0.254 2.794) (xy 0.508 2.794) (xy 0.508 2.032)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.016 6.35) (xy 0.508 7.874) (xy -0.254 7.874) (xy 0.508 7.874) (xy 0.508 7.112)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 -3.81) (xy 1.524 -2.286) (xy 0.762 -2.286) (xy 1.524 -2.286) (xy 1.524 -3.048)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 1.27) (xy 1.524 2.794) (xy 0.762 2.794) (xy 1.524 2.794) (xy 1.524 2.032)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 6.35) (xy 1.524 7.874) (xy 0.762 7.874) (xy 1.524 7.874) (xy 1.524 7.112)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 1.27 -1.27)
					(end 1.27 1.27)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 1.27 1.27)
					(end 1.27 1.27)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 1.27 3.81)
					(end 1.27 6.35)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 1.27 6.35)
					(end 1.27 6.35)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 2.032 0)
					(radius 0.254)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type outline)
					)
				)
				(rectangle
					(start 2.794 8.382)
					(end -2.794 -7.62)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "LED_BGRA_1_1"
				(pin passive line
					(at -5.08 -5.08 0)
					(length 2.54)
					(name "BK"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at -5.08 0 0)
					(length 2.54)
					(name "GK"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at -5.08 5.08 0)
					(length 2.54)
					(name "RK"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 5.08 0 180)
					(length 2.54)
					(name "A"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:+3V3-power"
			(power)
			(pin_names
				(offset 0)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "#PWR"
				(at 0 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Value" "power_+3V3"
				(at 0 3.556 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "+3V3-power_0_1"
				(polyline
					(pts
						(xy -0.762 1.27) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 0) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 2.54) (xy 0.762 1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "+3V3-power_1_1"
				(pin power_in line
					(at 0 0 90)
					(length 0) hide
					(name "+3V3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:+5V-power"
			(power)
			(pin_names
				(offset 0)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "#PWR"
				(at 0 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Value" "power_+5V"
				(at 0 3.556 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "+5V-power_0_1"
				(polyline
					(pts
						(xy -0.762 1.27) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 0) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 2.54) (xy 0.762 1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "+5V-power_1_1"
				(pin power_in line
					(at 0 0 90)
					(length 0) hide
					(name "+5V"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:+BATT-power"
			(power)
			(pin_names
				(offset 0)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "#PWR"
				(at 0 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Value" "power_+BATT"
				(at 0 3.556 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "+BATT-power_0_1"
				(polyline
					(pts
						(xy -0.762 1.27) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 0) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 2.54) (xy 0.762 1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "+BATT-power_1_1"
				(pin power_in line
					(at 0 0 90)
					(length 0) hide
					(name "+BATT"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:AP2112K-3.3-Regulator_Linear"
			(pin_names
				(offset 0.254)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -5.08 5.715 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Regulator_Linear_AP2112K-3.3"
				(at 0 5.715 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" "Package_TO_SOT_SMD:SOT-23-5"
				(at 0 8.255 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "SOT?23?5*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "AP2112K-3.3-Regulator_Linear_0_1"
				(rectangle
					(start -5.08 4.445)
					(end 5.08 -5.08)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "AP2112K-3.3-Regulator_Linear_1_1"
				(pin power_in line
					(at -7.62 2.54 0)
					(length 2.54)
					(name "VIN"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 -7.62 90)
					(length 2.54)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -7.62 0 0)
					(length 2.54)
					(name "EN"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin no_connect line
					(at 7.62 0 180)
					(length 2.54) hide
					(name "NC"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_out line
					(at 7.62 2.54 180)
					(length 2.54)
					(name "VOUT"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:CP-Device"
			(pin_numbers hide)
			(pin_names
				(offset 0.254)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "C"
				(at 0.635 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Device_CP"
				(at 0.635 -2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 0.9652 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "CP_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "CP-Device_0_1"
				(rectangle
					(start -2.286 0.508)
					(end 2.286 1.016)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.778 2.286) (xy -0.762 2.286)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 2.794) (xy -1.27 1.778)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 2.286 -0.508)
					(end -2.286 -1.016)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type outline)
					)
				)
			)
			(symbol "CP-Device_1_1"
				(pin passive line
					(at 0 3.81 270)
					(length 2.794)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -3.81 90)
					(length 2.794)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:Conn_01x02_Female-Connector"
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "J"
				(at 0 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "Connector_Conn_01x02_Female"
				(at 0 -5.08 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "Connector*:*_1x??_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Conn_01x02_Female-Connector_1_1"
				(arc
					(start 0 -2.032)
					(mid -0.508 -2.54)
					(end 0 -3.048)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 -2.54) (xy -0.508 -2.54)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 0) (xy -0.508 0)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 0 0.508)
					(mid -0.508 0)
					(end 0 -0.508)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(pin passive line
					(at -5.08 0 0)
					(length 3.81)
					(name "Pin_1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at -5.08 -2.54 0)
					(length 3.81)
					(name "Pin_2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:Conn_01x04_Female-Connector"
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "J"
				(at 0 5.08 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "Connector_Conn_01x04_Female"
				(at 0 -7.62 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "Connector*:*_1x??_*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Conn_01x04_Female-Connector_1_1"
				(arc
					(start 0 -4.572)
					(mid -0.508 -5.08)
					(end 0 -5.588)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 0 -2.032)
					(mid -0.508 -2.54)
					(end 0 -3.048)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 -5.08) (xy -0.508 -5.08)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 -2.54) (xy -0.508 -2.54)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 0) (xy -0.508 0)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 2.54) (xy -0.508 2.54)
					)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 0 0.508)
					(mid -0.508 0)
					(end 0 -0.508)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 0 3.048)
					(mid -0.508 2.54)
					(end 0 2.032)
					(stroke
						(width 0.1524)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(pin passive line
					(at -5.08 2.54 0)
					(length 3.81)
					(name "Pin_1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at -5.08 0 0)
					(length 3.81)
					(name "Pin_2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at -5.08 -2.54 0)
					(length 3.81)
					(name "Pin_3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at -5.08 -5.08 0)
					(length 3.81)
					(name "Pin_4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:Crystal_GND24_Small-Device"
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "Y"
				(at 1.27 4.445 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Crystal_GND24_Small-Device"
				(at 1.27 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "Crystal*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Crystal_GND24_Small-Device_0_1"
				(rectangle
					(start -0.762 -1.524)
					(end 0.762 1.524)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 -0.762) (xy -1.27 0.762)
					)
					(stroke
						(width 0.381)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 -0.762) (xy 1.27 0.762)
					)
					(stroke
						(width 0.381)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 -1.27) (xy -1.27 -1.905) (xy 1.27 -1.905) (xy 1.27 -1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.27 1.27) (xy -1.27 1.905) (xy 1.27 1.905) (xy 1.27 1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "Crystal_GND24_Small-Device_1_1"
				(pin passive line
					(at -2.54 0 0)
					(length 1.27)
					(name "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -3.175 90)
					(length 1.27)
					(name "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 2.54 0 180)
					(length 1.27)
					(name "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 3.175 270)
					(length 1.27)
					(name "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:D_TVS_x2_AAC-Device"
			(pin_names
				(offset 1.016) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "D"
				(at 0 4.445 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "Device_D_TVS_x2_AAC"
				(at 0 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at -3.81 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at -3.81 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "D_TVS_x2_AAC-Device_0_0"
				(polyline
					(pts
						(xy 0 -1.27) (xy 0 0)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "D_TVS_x2_AAC-Device_0_1"
				(polyline
					(pts
						(xy -6.35 0) (xy 6.35 0)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -3.302 1.27) (xy -3.81 1.27) (xy -3.81 -1.27) (xy -4.318 -1.27)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 4.318 1.27) (xy 3.81 1.27) (xy 3.81 -1.27) (xy 3.302 -1.27)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -6.35 -1.27) (xy -1.27 1.27) (xy -1.27 -1.27) (xy -6.35 1.27) (xy -6.35 -1.27)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 1.27 -1.27) (xy 1.27 1.27) (xy 6.35 -1.27) (xy 6.35 1.27) (xy 1.27 -1.27)
					)
					(stroke
						(width 0.2032)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(circle
					(center 0 0)
					(radius 0.254)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type outline)
					)
				)
			)
			(symbol "D_TVS_x2_AAC-Device_1_1"
				(pin passive line
					(at -8.89 0 0)
					(length 2.54)
					(name "A1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 8.89 0 180)
					(length 2.54)
					(name "A2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at 0 -3.81 90)
					(length 2.54)
					(name "common"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:Ferrite_Bead-Device"
			(pin_numbers hide)
			(pin_names
				(offset 0)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "FB"
				(at -3.81 0.635 90)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "Device_Ferrite_Bead"
				(at 3.81 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at -1.778 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "Inductor_* L_* *Ferrite*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "Ferrite_Bead-Device_0_1"
				(polyline
					(pts
						(xy 0 -1.27) (xy 0 -1.2192)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 1.27) (xy 0 1.2954)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.7686 0.4064) (xy -1.7018 2.2606) (xy 2.7686 -0.3048) (xy 1.6764 -2.159) (xy -2.7686 0.4064)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "Ferrite_Bead-Device_1_1"
				(pin passive line
					(at 0 3.81 270)
					(length 2.54)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 0 -3.81 90)
					(length 2.54)
					(name "~"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:GND-power"
			(power)
			(pin_names
				(offset 0)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "#PWR"
				(at 0 -6.35 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Value" "power_GND"
				(at 0 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "GND-power_0_1"
				(polyline
					(pts
						(xy 0 0) (xy 0 -1.27) (xy 1.27 -1.27) (xy 0 -2.54) (xy -1.27 -1.27) (xy 0 -1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "GND-power_1_1"
				(pin power_in line
					(at 0 0 270)
					(length 0) hide
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:INDUCTOR-pspice"
			(pin_numbers hide)
			(pin_names
				(offset 0)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "L"
				(at 0 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "pspice_INDUCTOR"
				(at 0 -1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "INDUCTOR-pspice_0_1"
				(arc
					(start -2.54 0)
					(mid -3.81 1.27)
					(end -5.08 0)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 0 0)
					(mid -1.27 1.27)
					(end -2.54 0)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 2.54 0)
					(mid 1.27 1.27)
					(end 0 0)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(arc
					(start 5.08 0)
					(mid 3.81 1.27)
					(end 2.54 0)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "INDUCTOR-pspice_1_1"
				(pin input line
					(at -6.35 0 0)
					(length 1.27)
					(name "1"
						(effects
							(font
								(size 0.762 0.762)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 0.762 0.762)
							)
						)
					)
				)
				(pin input line
					(at 6.35 0 180)
					(length 1.27)
					(name "2"
						(effects
							(font
								(size 0.762 0.762)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 0.762 0.762)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:MCP1640BCH-Regulator_Switching"
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -7.62 8.89 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Regulator_Switching_MCP1640BCH"
				(at -1.27 8.89 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" "Package_TO_SOT_SMD:SOT-23-6"
				(at 1.27 -6.35 0)
				(effects
					(font
						(size 1.27 1.27)
						(italic yes)
					)
					(justify left)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at -6.35 11.43 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "SOT?23*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "MCP1640BCH-Regulator_Switching_0_1"
				(rectangle
					(start -7.62 7.62)
					(end 7.62 -5.08)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "MCP1640BCH-Regulator_Switching_1_1"
				(pin input line
					(at 10.16 5.08 180)
					(length 2.54)
					(name "SW"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 -7.62 90)
					(length 2.54)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -10.16 0 0)
					(length 2.54)
					(name "EN"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at 10.16 -2.54 180)
					(length 2.54)
					(name "VFB"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_out line
					(at 10.16 2.54 180)
					(length 2.54)
					(name "VOUT"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at -10.16 5.08 0)
					(length 2.54)
					(name "VIN"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:MCP73831-2-OT-Battery_Management"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -7.62 6.35 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Battery_Management_MCP73831-2-OT"
				(at 1.27 6.35 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" "Package_TO_SOT_SMD:SOT-23-5"
				(at 1.27 -6.35 0)
				(effects
					(font
						(size 1.27 1.27)
						(italic yes)
					)
					(justify left)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at -3.81 -1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "SOT?23*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "MCP73831-2-OT-Battery_Management_0_1"
				(rectangle
					(start -7.62 5.08)
					(end 7.62 -5.08)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "MCP73831-2-OT-Battery_Management_1_1"
				(pin output line
					(at 10.16 -2.54 180)
					(length 2.54)
					(name "STAT"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 -7.62 90)
					(length 2.54)
					(name "VSS"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_out line
					(at 10.16 2.54 180)
					(length 2.54)
					(name "VBAT"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 7.62 270)
					(length 2.54)
					(name "VDD"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -10.16 -2.54 0)
					(length 2.54)
					(name "PROG"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:OIBUS_12.1_CONN-OIBUS_20"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "H"
				(at -5.08 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "OIBUS_20_OIBUS_12.1_CONN"
				(at 0 -22.86 0)
				(effects
					(font
						(size 0.762 0.762)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "OIBUS_12.1_CONN-OIBUS_20_0_1"
				(rectangle
					(start -7.62 -5.08)
					(end 7.62 -24.13)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "OIBUS_12.1_CONN-OIBUS_20_1_1"
				(pin power_in line
					(at -10.16 -7.62 0)
					(length 2.54)
					(name "5V"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 10.16 -17.78 180)
					(length 2.54)
					(name "I/O"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "10"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -10.16 -20.32 0)
					(length 2.54)
					(name "CANH"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "11"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 10.16 -20.32 180)
					(length 2.54)
					(name "CANL"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "12"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 10.16 -7.62 180)
					(length 2.54)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at -10.16 -10.16 0)
					(length 2.54)
					(name "3V3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 10.16 -10.16 180)
					(length 2.54)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -10.16 -12.7 0)
					(length 2.54)
					(name "SDA"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 10.16 -12.7 180)
					(length 2.54)
					(name "SCL"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -10.16 -15.24 0)
					(length 2.54)
					(name "MOSI"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "7"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 10.16 -15.24 180)
					(length 2.54)
					(name "MISO"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "8"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -10.16 -17.78 0)
					(length 2.54)
					(name "SPI_SCK"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "9"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:OI_Logo-OIBUS_20"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "B"
				(at -5.08 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Value" "OIBUS_20_OI_Logo"
				(at 0 2.54 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "Octanis*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "OI_Logo-OIBUS_20_0_0"
				(text "Octanis Instruments"
					(at 0 0 0)
					(effects
						(font
							(size 0.508 0.508)
						)
					)
				)
			)
			(symbol "OI_Logo-OIBUS_20_0_1"
				(rectangle
					(start -3.81 1.27)
					(end 3.81 -1.27)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:PWR_FLAG-power"
			(power)
			(pin_numbers hide)
			(pin_names
				(offset 0) hide)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "#FLG"
				(at 0 1.905 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Value" "power_PWR_FLAG"
				(at 0 3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "PWR_FLAG-power_0_0"
				(pin power_out line
					(at 0 0 90)
					(length 0)
					(name "pwr"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
			(symbol "PWR_FLAG-power_0_1"
				(polyline
					(pts
						(xy 0 0) (xy 0 1.27) (xy -1.016 1.905) (xy 0 2.54) (xy 1.016 1.905) (xy 0 1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:STM32F303CCTx-MCU_ST_STM32F3"
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "U"
				(at -15.24 36.83 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "MCU_ST_STM32F3_STM32F303CCTx"
				(at 7.62 36.83 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" "Package_QFP:LQFP-48_7x7mm_P0.5mm"
				(at -15.24 -35.56 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify right)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "LQFP*7x7mm*P0.5mm*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "STM32F303CCTx-MCU_ST_STM32F3_0_1"
				(rectangle
					(start -15.24 -35.56)
					(end 12.7 35.56)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "STM32F303CCTx-MCU_ST_STM32F3_1_1"
				(pin power_in line
					(at -5.08 38.1 270)
					(length 2.54)
					(name "VBAT"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 5.08 180)
					(length 2.54)
					(name "PA0"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "10"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 2.54 180)
					(length 2.54)
					(name "PA1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "11"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 0 180)
					(length 2.54)
					(name "PA2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "12"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -2.54 180)
					(length 2.54)
					(name "PA3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "13"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -5.08 180)
					(length 2.54)
					(name "PA4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "14"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -7.62 180)
					(length 2.54)
					(name "PA5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "15"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -10.16 180)
					(length 2.54)
					(name "PA6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "16"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -12.7 180)
					(length 2.54)
					(name "PA7"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "17"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 5.08 0)
					(length 2.54)
					(name "PB0"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "18"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 2.54 0)
					(length 2.54)
					(name "PB1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "19"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 15.24 0)
					(length 2.54)
					(name "PC13"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 0 0)
					(length 2.54)
					(name "PB2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "20"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -20.32 0)
					(length 2.54)
					(name "PB10"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "21"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -22.86 0)
					(length 2.54)
					(name "PB11"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "22"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at -5.08 -38.1 90)
					(length 2.54)
					(name "VSS"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "23"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at -2.54 38.1 270)
					(length 2.54)
					(name "VDD"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "24"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -25.4 0)
					(length 2.54)
					(name "PB12"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "25"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -27.94 0)
					(length 2.54)
					(name "PB13"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "26"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -30.48 0)
					(length 2.54)
					(name "PB14"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "27"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -33.02 0)
					(length 2.54)
					(name "PB15"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "28"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -15.24 180)
					(length 2.54)
					(name "PA8"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "29"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 12.7 0)
					(length 2.54)
					(name "PC14"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -17.78 180)
					(length 2.54)
					(name "PA9"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "30"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -20.32 180)
					(length 2.54)
					(name "PA10"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "31"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -22.86 180)
					(length 2.54)
					(name "PA11"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "32"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -25.4 180)
					(length 2.54)
					(name "PA12"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "33"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -27.94 180)
					(length 2.54)
					(name "PA13"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "34"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at -2.54 -38.1 90)
					(length 2.54)
					(name "VSS"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "35"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 38.1 270)
					(length 2.54)
					(name "VDD"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "36"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -30.48 180)
					(length 2.54)
					(name "PA14"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "37"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at 15.24 -33.02 180)
					(length 2.54)
					(name "PA15"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "38"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -2.54 0)
					(length 2.54)
					(name "PB3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "39"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 10.16 0)
					(length 2.54)
					(name "PC15"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -5.08 0)
					(length 2.54)
					(name "PB4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "40"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -7.62 0)
					(length 2.54)
					(name "PB5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "41"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -10.16 0)
					(length 2.54)
					(name "PB6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "42"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -12.7 0)
					(length 2.54)
					(name "PB7"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "43"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -17.78 27.94 0)
					(length 2.54)
					(name "BOOT0"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "44"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -15.24 0)
					(length 2.54)
					(name "PB8"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "45"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin bidirectional line
					(at -17.78 -17.78 0)
					(length 2.54)
					(name "PB9"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "46"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 0 -38.1 90)
					(length 2.54)
					(name "VSS"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "47"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 2.54 38.1 270)
					(length 2.54)
					(name "VDD"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "48"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -17.78 22.86 0)
					(length 2.54)
					(name "PF0"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -17.78 20.32 0)
					(length 2.54)
					(name "PF1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -17.78 33.02 0)
					(length 2.54)
					(name "NRST"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "7"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 2.54 -38.1 90)
					(length 2.54)
					(name "VSSA"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "8"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_in line
					(at 5.08 38.1 270)
					(length 2.54)
					(name "VDDA"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "9"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:TC2030-MCP-Tag-Connect"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "P"
				(at 10.16 2.54 0)
				(effects
					(font
						(size 1.524 1.524)
					)
				)
			)
			(property "Value" "Tag-Connect_TC2030-MCP"
				(at 10.16 -15.24 0)
				(effects
					(font
						(size 1.524 1.524)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "TC2030-MCP"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "TC2030-MCP-Tag-Connect_0_1"
				(rectangle
					(start 0 1.27)
					(end 20.32 -13.97)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "TC2030-MCP-Tag-Connect_1_1"
				(pin input line
					(at -7.62 0 0)
					(length 7.62)
					(name "~{RESET}"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 27.94 -2.54 180)
					(length 7.62)
					(name "Vdd"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 27.94 -5.08 180)
					(length 7.62)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -7.62 -7.62 0)
					(length 7.62)
					(name "SWDIO"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -7.62 -10.16 0)
					(length 7.62)
					(name "SWCLK"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin input line
					(at -7.62 -12.7 0)
					(length 7.62)
					(name "SWO"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:USB_B_Micro-Connector"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "J"
				(at -5.08 11.43 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Value" "Connector_USB_B_Micro"
				(at -5.08 8.89 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" ""
				(at 3.81 -1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 3.81 -1.27 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "USB*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "USB_B_Micro-Connector_0_1"
				(rectangle
					(start -5.08 -7.62)
					(end 5.08 7.62)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type background)
					)
				)
				(circle
					(center -3.81 2.159)
					(radius 0.635)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type outline)
					)
				)
				(circle
					(center -0.635 3.429)
					(radius 0.381)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type outline)
					)
				)
				(rectangle
					(start -0.127 -7.62)
					(end 0.127 -6.858)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -1.905 2.159) (xy 0.635 2.159)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -3.175 2.159) (xy -2.54 2.159) (xy -1.27 3.429) (xy -0.635 3.429)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy -2.54 2.159) (xy -1.905 2.159) (xy -1.27 0.889) (xy 0 0.889)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0.635 2.794) (xy 0.635 1.524) (xy 1.905 2.159) (xy 0.635 2.794)
					)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type outline)
					)
				)
				(polyline
					(pts
						(xy -4.318 5.588) (xy -1.778 5.588) (xy -2.032 4.826) (xy -4.064 4.826) (xy -4.318 5.588)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type outline)
					)
				)
				(polyline
					(pts
						(xy -4.699 5.842) (xy -4.699 5.588) (xy -4.445 4.826) (xy -4.445 4.572) (xy -1.651 4.572) (xy -1.651 4.826)
						(xy -1.397 5.588) (xy -1.397 5.842) (xy -4.699 5.842)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 0.254 1.27)
					(end -0.508 0.508)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type outline)
					)
				)
				(rectangle
					(start 5.08 -5.207)
					(end 4.318 -4.953)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 5.08 -2.667)
					(end 4.318 -2.413)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 5.08 -0.127)
					(end 4.318 0.127)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 5.08 4.953)
					(end 4.318 5.207)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "USB_B_Micro-Connector_1_1"
				(pin power_out line
					(at 7.62 5.08 180)
					(length 2.54)
					(name "VBUS"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 7.62 -2.54 180)
					(length 2.54)
					(name "D-"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 7.62 0 180)
					(length 2.54)
					(name "D+"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 7.62 -5.08 180)
					(length 2.54)
					(name "ID"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin power_out line
					(at 0 -10.16 90)
					(length 2.54)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at -2.54 -10.16 90)
					(length 2.54)
					(name "Shield"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "6"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:VBUS-power"
			(power)
			(pin_names
				(offset 0)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "#PWR"
				(at 0 -3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Value" "power_VBUS"
				(at 0 3.81 0)
				(effects
					(font
						(size 1.27 1.27)
					)
				)
			)
			(property "Footprint" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "VBUS-power_0_1"
				(polyline
					(pts
						(xy -0.762 1.27) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 0) (xy 0 2.54)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(polyline
					(pts
						(xy 0 2.54) (xy 0.762 1.27)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
			)
			(symbol "VBUS-power_1_1"
				(pin power_in line
					(at 0 0 90)
					(length 0) hide
					(name "VBUS"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
		(symbol "oibus-mini-CCC-rescue:uavcan_5pins-uavcan_connector"
			(pin_names
				(offset 1.016)
			)
			(exclude_from_sim no)
			(in_bom yes)
			(on_board yes)
			(property "Reference" "J"
				(at -1.27 7.62 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify right)
				)
			)
			(property "Value" "uavcan_connector_uavcan_5pins"
				(at -5.08 -3.81 90)
				(effects
					(font
						(size 1.27 1.27)
					)
					(justify left)
				)
			)
			(property "Footprint" "lib_fp_global:Molex_PicoBlade_53048-0510_1x05_P1.25mm_Horizontal"
				(at -3.81 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Datasheet" ""
				(at -3.81 0 90)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "Description" ""
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(property "ki_fp_filters" "uav* can*"
				(at 0 0 0)
				(effects
					(font
						(size 1.27 1.27)
					)
					(hide yes)
				)
			)
			(symbol "uavcan_5pins-uavcan_connector_0_0"
				(pin passive line
					(at 6.35 -6.35 180)
					(length 2.54)
					(name "VBUS"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "1"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
			(symbol "uavcan_5pins-uavcan_connector_0_1"
				(polyline
					(pts
						(xy 3.81 5.08) (xy -2.54 5.08) (xy -2.54 -7.62) (xy 3.81 -7.62)
					)
					(stroke
						(width 0)
						(type solid)
					)
					(fill
						(type none)
					)
				)
				(rectangle
					(start 3.81 6.35)
					(end -3.81 -8.89)
					(stroke
						(width 0.254)
						(type solid)
					)
					(fill
						(type background)
					)
				)
			)
			(symbol "uavcan_5pins-uavcan_connector_1_1"
				(pin passive line
					(at 6.35 -3.81 180)
					(length 2.54)
					(name "5V"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "2"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 6.35 -1.27 180)
					(length 2.54)
					(name "CANH"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "3"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 6.35 1.27 180)
					(length 2.54)
					(name "CANL"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "4"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
				(pin passive line
					(at 6.35 3.81 180)
					(length 2.54)
					(name "GND"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
					(number "5"
						(effects
							(font
								(size 1.27 1.27)
							)
						)
					)
				)
			)
		)
	)
	(junction
		(at 339.09 39.37)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "022f1415-bb54-41ea-b0ef-4589b1572f27")
	)
	(junction
		(at 363.22 44.45)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "0be7cbd8-53bd-4b2a-a52c-4fce31fdfd73")
	)
	(junction
		(at 336.55 29.21)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "0de23740-4a5d-4085-987e-a496479c9591")
	)
	(junction
		(at 290.83 62.23)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "0e71725a-ce0a-42fb-a550-7ef05fde5ef7")
	)
	(junction
		(at 359.41 227.33)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "1718d509-f28e-44ca-86c1-a16cdf885b9d")
	)
	(junction
		(at 353.06 172.72)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "19ee0e0e-7fec-4a23-a27c-b80c52279427")
	)
	(junction
		(at 81.28 273.05)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "1ab57039-817f-48fd-ad0a-bf66cd1a3aa2")
	)
	(junction
		(at 91.44 27.94)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "2084ce99-d3da-4860-b704-3d96827e18a3")
	)
	(junction
		(at 20.32 259.08)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "22538a6e-36fe-44be-be49-7b89288a660d")
	)
	(junction
		(at 95.25 226.06)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "25d513ff-71ee-4228-8d6e-9b31a9d9c2e8")
	)
	(junction
		(at 153.67 213.36)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "297ea9ce-4fcc-4a96-b93d-95d43ec53649")
	)
	(junction
		(at 179.07 127)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "2f2912cd-3737-44af-9251-ed7879dc861c")
	)
	(junction
		(at 359.41 224.79)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "2fed98ac-7595-427d-86dd-701dc3251ec2")
	)
	(junction
		(at 300.99 59.69)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "32009632-5a8a-4da3-be7d-d9f5a293022a")
	)
	(junction
		(at 227.33 120.65)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "3266cd61-b2ab-43c3-9525-2f231c914a48")
	)
	(junction
		(at 266.7 60.96)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "37ee92ac-1590-405c-9e34-2d2e9fd0dd2d")
	)
	(junction
		(at 46.99 267.97)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "3b2fa5cb-3cc0-42f4-bb40-2ee3aba32076")
	)
	(junction
		(at 336.55 39.37)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "3c69eaf9-f3ac-42a7-bd66-13d088de424a")
	)
	(junction
		(at 36.83 226.06)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "3d322921-c8e8-468b-9dbd-6b2dd086dcd8")
	)
	(junction
		(at 251.46 60.96)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "3f3bd2a6-cf54-49a7-9f8d-166741ff7642")
	)
	(junction
		(at 167.64 200.66)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "41e5ab9a-9082-4fa0-9878-5dad1bba5212")
	)
	(junction
		(at 299.72 76.2)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "493a5d91-d315-4e94-8ddd-61cfd8332688")
	)
	(junction
		(at 66.04 260.35)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "4e3bdef3-b803-4f6c-a2c1-f10a8105bbb5")
	)
	(junction
		(at 125.73 227.33)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "5199bcdc-07b2-4b2d-967a-a80c01483efa")
	)
	(junction
		(at 26.67 214.63)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "51b7210e-96d6-4d00-987a-cc70d9e6d9e5")
	)
	(junction
		(at 167.64 276.86)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "5764fa2c-95ce-4d68-873a-3321517e92fd")
	)
	(junction
		(at 236.22 171.45)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "59440795-450a-4e82-8262-084825c3eecd")
	)
	(junction
		(at 167.64 227.33)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "599d6415-a42c-4132-8580-06d41c869c0c")
	)
	(junction
		(at 172.72 227.33)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "5c2ba0ae-60e1-4ed6-8314-c905c0c540b2")
	)
	(junction
		(at 381 226.06)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "5feedcc8-008d-4aa8-905c-2931696931e6")
	)
	(junction
		(at 106.68 86.36)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "61eece42-8ab1-4fa0-9650-a75cac2dfb5c")
	)
	(junction
		(at 139.7 203.2)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "677bb056-9cf7-4e34-8acb-e39b07ee8676")
	)
	(junction
		(at 66.04 262.89)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "6acc7602-6a80-4d7d-b946-8cc6a4330771")
	)
	(junction
		(at 341.63 39.37)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "6c2433b2-7af8-4fa9-a235-87b168381cab")
	)
	(junction
		(at 236.22 189.23)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "6f971c56-b75a-4fa3-a581-a57032749371")
	)
	(junction
		(at 128.27 257.81)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "734f594c-212e-4d6f-8a90-f5f2715cfa85")
	)
	(junction
		(at 179.07 50.8)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "7610e4cb-93be-41ba-b232-7ee44f7ef739")
	)
	(junction
		(at 179.07 40.64)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "762d2ce9-3cbc-45a7-bab2-5355e65eb3fd")
	)
	(junction
		(at 26.67 226.06)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "78337435-44da-4263-b857-ad9bf0955975")
	)
	(junction
		(at 167.64 257.81)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "7873e1b5-dc56-4b6f-a524-63e0aaa02f5d")
	)
	(junction
		(at 167.64 266.7)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "79c7031e-14f3-4e20-8bb3-2473419d7666")
	)
	(junction
		(at 36.83 214.63)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "7cc38952-0648-473a-9427-bab87dda2624")
	)
	(junction
		(at 374.65 217.17)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "80069936-739e-4f19-8fd6-7b7bbcbde4df")
	)
	(junction
		(at 123.19 152.4)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "80e3f967-f479-463b-9f45-d5c7b7b12600")
	)
	(junction
		(at 391.16 226.06)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "8615ea7d-1ceb-4f54-a134-ef05a5a05546")
	)
	(junction
		(at 304.165 62.23)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "9279c2af-52e6-4c4c-9a1f-0ff5becd9df9")
	)
	(junction
		(at 58.42 226.06)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "93cea443-8c74-4857-8211-940079c85a5f")
	)
	(junction
		(at 336.55 123.19)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "9646cf03-16cd-497d-beba-df4832ab638c")
	)
	(junction
		(at 220.98 189.23)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "9918764e-8712-450b-a22c-c929c0a3de9c")
	)
	(junction
		(at 96.52 260.35)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "a6ddb133-b6fc-4f62-aa7b-d00560627445")
	)
	(junction
		(at 101.6 83.82)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "a778608f-d302-4fb4-a050-80f9a7a49d6b")
	)
	(junction
		(at 96.52 167.64)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "a7e3075b-08e6-424c-bbfb-0d6e4e4d5047")
	)
	(junction
		(at 20.32 267.97)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "abe4df8a-be1a-4098-bf4c-2eea6f53a41e")
	)
	(junction
		(at 339.09 123.19)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "b74e29d1-6f9c-44b5-a24d-9491b3b8ac8e")
	)
	(junction
		(at 172.72 48.26)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "be250c1f-5227-456a-b829-f99bbf04425b")
	)
	(junction
		(at 34.29 267.97)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "c0578ec3-5b5b-44bb-97b2-2f25af79fa4a")
	)
	(junction
		(at 372.11 44.45)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "c0a7b19f-8349-40ed-b83c-42a266b7dcf3")
	)
	(junction
		(at 143.51 276.86)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "c3f0ef68-061f-44f5-bc97-85675d1deced")
	)
	(junction
		(at 350.52 34.29)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "c6713b8f-d170-412f-9561-8259cf1c2ab2")
	)
	(junction
		(at 172.72 214.63)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "c98d2743-3338-4964-a937-21908c99dd6b")
	)
	(junction
		(at 182.88 257.81)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "d00b34ca-9831-417d-adae-954a36814b74")
	)
	(junction
		(at 299.72 68.58)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "d5246d02-a57d-4969-978b-38cfe9a7cd95")
	)
	(junction
		(at 217.17 60.96)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "d8613d2e-247d-4633-b267-506a24d0fd4c")
	)
	(junction
		(at 372.11 52.07)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "da5dd566-8166-413c-8c9c-7d1e03d7d981")
	)
	(junction
		(at 172.72 50.8)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "e0412e0d-b2af-49eb-9b9c-0e0e95b42554")
	)
	(junction
		(at 300.99 64.77)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "f2be7239-3954-424f-ab7e-1bc8cca6e44f")
	)
	(junction
		(at 374.65 234.95)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "f3cf9cd2-5c27-4bd9-82f7-e28049df5046")
	)
	(junction
		(at 290.83 72.39)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "f5ce91df-6e47-4db3-b377-d05905f93860")
	)
	(junction
		(at 153.67 227.33)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "f7508a3f-dbd6-4183-a71c-fc37081ae1b1")
	)
	(junction
		(at 125.73 203.2)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "f97ae8b7-7cb5-4a0d-8303-08ad9f15c9de")
	)
	(junction
		(at 91.44 30.48)
		(diameter 0)
		(color 0 0 0 0)
		(uuid "fb0471d7-9c97-443a-a5d1-a6ebaff4f419")
	)
	(no_connect
		(at 92.71 147.32)
		(uuid "0fb6818d-b70c-4103-ad64-0ed0ac065654")
	)
	(no_connect
		(at 33.02 45.72)
		(uuid "14e8d33f-d16f-4e86-b5f3-eae66467f026")
	)
	(no_connect
		(at 92.71 144.78)
		(uuid "22c342f2-b026-4258-a752-dcbf131ca32d")
	)
	(no_connect
		(at 36.83 152.4)
		(uuid "22cab337-f8d4-42f3-909c-28ea1703a490")
	)
	(no_connect
		(at 36.83 160.02)
		(uuid "28df039c-d3ab-4eec-885c-cee736dff48f")
	)
	(no_connect
		(at 92.71 129.54)
		(uuid "29744616-f463-4974-839f-7cd7171b1b29")
	)
	(no_connect
		(at 36.83 154.94)
		(uuid "396c7fe9-ce7a-4d9e-a7c4-ed3f9af0a1a3")
	)
	(no_connect
		(at 36.83 114.3)
		(uuid "39f4eaa8-e471-4c26-9d1e-dc3b1a63f4fc")
	)
	(no_connect
		(at 58.42 209.55)
		(uuid "3c84340f-76ef-4e1d-8aca-994fa62dba23")
	)
	(no_connect
		(at 92.71 157.48)
		(uuid "5a0d313c-dda9-4e03-85e9-896c249017ea")
	)
	(no_connect
		(at 36.83 134.62)
		(uuid "5ac095d7-6258-40ec-9b8a-1b3a6b1bb45b")
	)
	(no_connect
		(at 36.83 144.78)
		(uuid "60cd9b60-a2d8-420c-ad9e-2967f93b57d3")
	)
	(no_connect
		(at 92.71 160.02)
		(uuid "7ede9e03-dab2-431e-9171-dfd0f4acc38a")
	)
	(no_connect
		(at 36.83 139.7)
		(uuid "81c31a16-5f52-4773-9542-bd91d1da2361")
	)
	(no_connect
		(at 92.71 154.94)
		(uuid "8b191016-8c3a-4c83-ad7d-4d47437616b2")
	)
	(no_connect
		(at 36.83 149.86)
		(uuid "9cd416fe-e77a-4a4b-b78a-d3a33630a243")
	)
	(no_connect
		(at 92.71 132.08)
		(uuid "9e19668a-af38-4021-a537-9f2afa5bb5f0")
	)
	(no_connect
		(at 92.71 93.98)
		(uuid "a3e1afa6-6d6b-4e1e-870e-56fbf97b5b36")
	)
	(no_connect
		(at 36.83 147.32)
		(uuid "a9c376a9-13db-4def-815f-a572bf561a67")
	)
	(no_connect
		(at 92.71 139.7)
		(uuid "b13b7526-240c-438a-98dc-d934913935d5")
	)
	(no_connect
		(at 134.62 43.18)
		(uuid "b7802fcc-f2c9-45d8-87dd-cb0dcfbd4d62")
	)
	(no_connect
		(at 36.83 157.48)
		(uuid "b9ef6c2d-13bf-4adf-84b8-72c41fad6aae")
	)
	(no_connect
		(at 92.71 91.44)
		(uuid "ba56e460-4299-4702-abad-dfbae592eefe")
	)
	(no_connect
		(at 92.71 96.52)
		(uuid "ba649dc4-3988-48d2-ba4d-a85e60e50b21")
	)
	(no_connect
		(at 33.02 48.26)
		(uuid "d0c3b2f6-e3aa-47b9-b1db-de4d87026eaa")
	)
	(no_connect
		(at 92.71 99.06)
		(uuid "d12e25ff-9499-4280-8a00-e58277564947")
	)
	(no_connect
		(at 92.71 142.24)
		(uuid "d3ff65cf-9afc-4683-92b3-eb0a6f2a1d60")
	)
	(no_connect
		(at 92.71 127)
		(uuid "d9f7d024-8248-42cd-b0f6-4b4e399188d0")
	)
	(no_connect
		(at 33.02 40.64)
		(uuid "e004378a-4d46-4acb-98cb-6ec6e1c89823")
	)
	(no_connect
		(at 92.71 137.16)
		(uuid "e0e0cc73-990a-4ecc-82e3-adb3897d9983")
	)
	(no_connect
		(at 33.02 53.34)
		(uuid "e284877d-21da-4dd5-be8b-82bb486875ce")
	)
	(no_connect
		(at 36.83 137.16)
		(uuid "e48bf6e9-35d3-4ffb-b8eb-4fc75dcfa433")
	)
	(no_connect
		(at 36.83 142.24)
		(uuid "f2642b28-8e17-4ff6-b796-9e92406c9460")
	)
	(no_connect
		(at 92.71 134.62)
		(uuid "f4690a85-dbc6-47ca-965c-b60d52196cf8")
	)
	(no_connect
		(at 92.71 152.4)
		(uuid "f4b82f31-a36c-4e4d-aaae-84daa8b35e43")
	)
	(no_connect
		(at 92.71 149.86)
		(uuid "fd7f2c70-9c98-4e48-89f4-048246810e41")
	)
	(wire
		(pts
			(xy 341.63 121.92) (xy 341.63 123.19)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "01233d83-1d0e-47ec-899a-a276ff019eaa")
	)
	(wire
		(pts
			(xy 299.72 68.58) (xy 297.18 68.58)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "01f3d7a4-65ec-4f4c-802f-d04985908cd0")
	)
	(wire
		(pts
			(xy 349.25 175.26) (xy 353.06 175.26)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "02740edc-a6a9-4bf4-a7dc-ceb73bc802b9")
	)
	(wire
		(pts
			(xy 231.14 120.65) (xy 227.33 120.65)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "03d81465-9e2c-473c-bcc9-b4ca0b110ee2")
	)
	(wire
		(pts
			(xy 378.46 226.06) (xy 381 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "049452d0-a620-4142-a313-330ac343c0b0")
	)
	(wire
		(pts
			(xy 153.67 265.43) (xy 162.56 265.43)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "055f563a-671b-4c82-9159-a645a9318536")
	)
	(wire
		(pts
			(xy 143.51 270.51) (xy 143.51 276.86)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "06006548-4c38-49fa-9be5-6ab5dd622b6a")
	)
	(wire
		(pts
			(xy 236.22 189.23) (xy 261.62 189.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "060dbbf7-f51b-48fb-a263-4e807d471e75")
	)
	(wire
		(pts
			(xy 308.61 88.9) (xy 321.31 88.9)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0621f436-92f7-4c59-a16e-949df84c9f79")
	)
	(wire
		(pts
			(xy 78.74 30.48) (xy 91.44 30.48)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "06cb26f9-80ca-4016-94b9-3c8695a29835")
	)
	(wire
		(pts
			(xy 20.32 259.08) (xy 26.67 259.08)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0705f977-1344-4e05-ab5b-2334516d9b9b")
	)
	(wire
		(pts
			(xy 96.52 260.35) (xy 96.52 264.16)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "073f222a-3bfd-4b26-8fd3-9bf6e7550727")
	)
	(wire
		(pts
			(xy 246.38 110.49) (xy 240.03 110.49)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "07b7ddbf-20cf-4db9-af58-8b1ae828c067")
	)
	(wire
		(pts
			(xy 29.21 96.52) (xy 36.83 96.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "084e6c29-bcf7-49ce-96ad-52f61448a9d9")
	)
	(wire
		(pts
			(xy 153.67 227.33) (xy 167.64 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "089e11a5-8ffa-4bcd-80f0-db775364288c")
	)
	(wire
		(pts
			(xy 266.7 60.96) (xy 270.51 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0993232d-b867-4f2d-ad25-c2c128df6a4f")
	)
	(wire
		(pts
			(xy 172.72 204.47) (xy 172.72 200.66)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0b86cab6-f8b5-4240-be16-1106bf9e4267")
	)
	(wire
		(pts
			(xy 227.33 92.71) (xy 227.33 97.79)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0c424d25-432a-4fb8-b97b-23aa2c00fb4e")
	)
	(wire
		(pts
			(xy 228.6 176.53) (xy 238.76 176.53)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0c834948-5781-4eff-843e-938836edfe61")
	)
	(wire
		(pts
			(xy 374.65 217.17) (xy 370.84 217.17)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0d0e0845-62ad-4441-a6ed-91e9ef10d58b")
	)
	(wire
		(pts
			(xy 147.32 203.2) (xy 139.7 203.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0d45a3e8-6c81-4ca1-a51b-3123466b199a")
	)
	(wire
		(pts
			(xy 317.5 114.3) (xy 321.31 114.3)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0daf40b9-afed-4573-ac61-ff4ba084dc73")
	)
	(wire
		(pts
			(xy 339.09 227.33) (xy 359.41 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0de7f9b9-33c2-4823-9b2e-fce1af1eaa94")
	)
	(wire
		(pts
			(xy 96.52 167.64) (xy 96.52 168.91)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0dfe8f2e-20fa-4fe2-b57b-0d057cc65ace")
	)
	(wire
		(pts
			(xy 81.28 273.05) (xy 81.28 274.32)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "0f6b12d9-0d1b-456d-b07d-c8258a16cecc")
	)
	(wire
		(pts
			(xy 290.83 72.39) (xy 290.83 69.85)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1134ac8f-ad59-441c-9c53-bf914bd744f7")
	)
	(wire
		(pts
			(xy 172.72 217.17) (xy 172.72 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "11a1ffb1-57e9-445e-91a0-781dad4a2d88")
	)
	(wire
		(pts
			(xy 297.18 74.93) (xy 297.18 76.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "120bbf4d-a15c-4b87-928f-3591304d959b")
	)
	(wire
		(pts
			(xy 353.06 185.42) (xy 349.25 185.42)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1223aa80-104a-435a-b829-e2b571d35ce8")
	)
	(wire
		(pts
			(xy 350.52 34.29) (xy 347.98 34.29)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1233adba-b124-40e3-a512-24d7b132aee2")
	)
	(wire
		(pts
			(xy 353.06 172.72) (xy 349.25 172.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1486971e-aff8-4779-9ab9-90be329bc41c")
	)
	(wire
		(pts
			(xy 165.1 48.26) (xy 172.72 48.26)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1514d7f3-0132-4c99-bdef-bbde2de98707")
	)
	(wire
		(pts
			(xy 179.07 125.73) (xy 179.07 127)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "166e5b6c-2331-42a1-8750-9e66a8ddaef1")
	)
	(wire
		(pts
			(xy 295.91 74.93) (xy 297.18 74.93)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "16aabc1f-ad37-4895-ad48-f160688c2866")
	)
	(wire
		(pts
			(xy 374.65 217.17) (xy 391.16 217.17)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "16ac3cac-8e01-4cce-bc4d-227b74070b32")
	)
	(wire
		(pts
			(xy 299.72 93.98) (xy 321.31 93.98)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "16ec20ce-8832-4bb5-b5cc-957a555af039")
	)
	(wire
		(pts
			(xy 299.72 85.09) (xy 299.72 86.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1704c1f8-64c6-4b8e-9937-368e57027d08")
	)
	(wire
		(pts
			(xy 355.6 229.87) (xy 355.6 231.14)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "17602bcf-2b08-4652-a015-fd6ae38622d9")
	)
	(wire
		(pts
			(xy 97.79 226.06) (xy 95.25 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1887d317-c4e9-48f7-8436-47aecdeeb350")
	)
	(wire
		(pts
			(xy 66.04 273.05) (xy 81.28 273.05)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "18f1a2e9-ca8f-4857-96c1-bda3d7dfe4ed")
	)
	(wire
		(pts
			(xy 248.92 180.34) (xy 248.92 171.45)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "18f49c94-64d7-4869-b8a5-7ca89b992de1")
	)
	(wire
		(pts
			(xy 205.74 40.64) (xy 209.55 40.64)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "18fdf29f-825a-4f65-b9fd-ed63f366a83a")
	)
	(wire
		(pts
			(xy 341.63 123.19) (xy 339.09 123.19)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "19cfd351-240c-4bb3-b9ef-1fd6008291c4")
	)
	(wire
		(pts
			(xy 36.83 101.6) (xy 29.21 101.6)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "19d1206a-15eb-4648-b348-d6302f5123f2")
	)
	(wire
		(pts
			(xy 135.89 218.44) (xy 135.89 224.79)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1b4b32d6-7a4a-4e83-9fb0-bea767b9618d")
	)
	(wire
		(pts
			(xy 328.93 177.8) (xy 325.12 177.8)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1b8212cd-a798-4fc6-a440-fba2f1c8bebd")
	)
	(wire
		(pts
			(xy 58.42 226.06) (xy 58.42 224.79)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1bf6a1aa-82d4-4057-9594-bd9e6e3e4e21")
	)
	(wire
		(pts
			(xy 66.04 260.35) (xy 66.04 262.89)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1c5dd89f-25c8-4991-a238-3ef7c0a5f0cd")
	)
	(wire
		(pts
			(xy 358.14 91.44) (xy 354.33 91.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1c97f10e-ee88-49bc-85a2-be6a2869c23d")
	)
	(wire
		(pts
			(xy 96.52 165.1) (xy 96.52 167.64)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1d1bb820-9116-4193-8221-954c1eab92d9")
	)
	(wire
		(pts
			(xy 354.33 34.29) (xy 350.52 34.29)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1e23a8e9-6c7d-4975-bc73-ef4ef6a58371")
	)
	(wire
		(pts
			(xy 353.06 175.26) (xy 353.06 172.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "1e7fc3cd-d29d-4519-8080-319f5686acec")
	)
	(wire
		(pts
			(xy 290.83 85.09) (xy 290.83 86.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "20249d0b-f7d4-4ae7-83bf-bb1792f20225")
	)
	(wire
		(pts
			(xy 349.25 177.8) (xy 353.06 177.8)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2228c6b4-049a-458d-aadc-faec5de795a0")
	)
	(wire
		(pts
			(xy 234.95 93.98) (xy 234.95 92.71)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "234a102c-b57b-4f0e-84e1-41e0fd34f816")
	)
	(wire
		(pts
			(xy 388.62 226.06) (xy 391.16 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "247e7918-5732-4267-9c75-2cdec2195ea9")
	)
	(wire
		(pts
			(xy 157.48 203.2) (xy 154.94 203.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "25193f0c-a565-4a75-8929-72c1a23a7bb9")
	)
	(wire
		(pts
			(xy 370.84 222.25) (xy 359.41 222.25)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "254827cd-61fd-4a87-aa19-4d99b5a2efbc")
	)
	(wire
		(pts
			(xy 134.62 48.26) (xy 128.27 48.26)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "26051184-e982-4945-8b75-b13ebfcc6a3c")
	)
	(polyline
		(pts
			(xy 191.77 12.7) (xy 191.77 284.48)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "2637c008-e39a-4409-b6b4-13c9b0f94b86")
	)
	(wire
		(pts
			(xy 273.05 19.05) (xy 273.05 27.94)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "277b3a42-799f-4e37-8dc3-b056258cac21")
	)
	(wire
		(pts
			(xy 59.69 234.95) (xy 95.25 234.95)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "278718e7-ea31-43f3-a171-d9ac9534b97d")
	)
	(wire
		(pts
			(xy 236.22 171.45) (xy 228.6 171.45)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "28034f0e-2f6b-4b62-aef3-1e4b37fa0761")
	)
	(wire
		(pts
			(xy 172.72 50.8) (xy 179.07 50.8)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "29dc6d5b-e9e7-4668-923d-a2403a1cc2a4")
	)
	(wire
		(pts
			(xy 125.73 203.2) (xy 125.73 208.28)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2a702384-9ef6-4bf7-a24f-d2c70eccbd83")
	)
	(wire
		(pts
			(xy 321.31 73.66) (xy 303.53 73.66)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2a79be68-7627-46df-a26c-794fb5a691cf")
	)
	(wire
		(pts
			(xy 92.71 86.36) (xy 106.68 86.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2a8c48d5-a521-4e4b-b2f4-ec32e5149e41")
	)
	(wire
		(pts
			(xy 92.71 167.64) (xy 96.52 167.64)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2a940919-16ba-43a3-9991-2db8c34a2536")
	)
	(wire
		(pts
			(xy 358.14 114.3) (xy 354.33 114.3)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2ad9ebcb-16e8-4f42-858d-b6d86f84628b")
	)
	(wire
		(pts
			(xy 328.93 180.34) (xy 325.12 180.34)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2c989521-490f-47c7-966e-93e541debbaa")
	)
	(wire
		(pts
			(xy 95.25 234.95) (xy 95.25 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2d74b556-8d06-4599-8085-7a748b401bf9")
	)
	(wire
		(pts
			(xy 218.44 189.23) (xy 220.98 189.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2d86b029-3afb-4f95-9d18-475910b0e86c")
	)
	(wire
		(pts
			(xy 317.5 109.22) (xy 321.31 109.22)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2d98818a-b714-49af-893a-0c0f47ad78ee")
	)
	(wire
		(pts
			(xy 78.74 38.1) (xy 99.06 38.1)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2db41b31-cc72-44b4-80ae-301e0792640a")
	)
	(wire
		(pts
			(xy 290.83 62.23) (xy 290.83 59.69)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2e6ab145-ebe3-42b5-8acb-fa84a100bd46")
	)
	(wire
		(pts
			(xy 133.35 96.52) (xy 139.7 96.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2f2ca130-03be-45f5-af3c-e027512ce2db")
	)
	(wire
		(pts
			(xy 342.9 39.37) (xy 341.63 39.37)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2f561334-fa51-4066-9859-8020048c1682")
	)
	(wire
		(pts
			(xy 240.03 102.87) (xy 246.38 102.87)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2f5806cf-c8a0-4184-b084-b31b7a0414d0")
	)
	(wire
		(pts
			(xy 354.33 109.22) (xy 394.97 109.22)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2f71b196-4c7f-438a-aef1-2e2aa02272b6")
	)
	(wire
		(pts
			(xy 317.5 116.84) (xy 321.31 116.84)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2fa967cb-af02-459c-be57-69110668d893")
	)
	(wire
		(pts
			(xy 339.09 123.19) (xy 339.09 121.92)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "2ffff620-453d-4a10-86f2-da3f7b09bfaf")
	)
	(wire
		(pts
			(xy 167.64 259.08) (xy 167.64 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "31ba7d03-56cc-4ca9-842c-8f5bb5b53565")
	)
	(wire
		(pts
			(xy 167.64 199.39) (xy 167.64 200.66)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3457b44c-ea39-4a67-be0d-6ecbf3ce07fc")
	)
	(wire
		(pts
			(xy 26.67 214.63) (xy 36.83 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "351b9ff3-dd2c-4ed7-b25a-38df2fbc7b0f")
	)
	(wire
		(pts
			(xy 318.77 175.26) (xy 328.93 175.26)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "35a95e36-e159-4391-b9ee-8a83879fafcd")
	)
	(polyline
		(pts
			(xy 59.69 241.3) (xy 59.69 284.48)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "35cdc4c2-be49-4691-b917-ba37c2df4795")
	)
	(wire
		(pts
			(xy 358.14 111.76) (xy 354.33 111.76)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "36a5c3eb-4048-4350-8541-17842b4d6842")
	)
	(wire
		(pts
			(xy 96.52 273.05) (xy 96.52 269.24)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "380915b3-8682-4aa9-9a62-cbb19999cbf6")
	)
	(wire
		(pts
			(xy 344.17 45.72) (xy 344.17 44.45)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "381e85fd-d6e7-454f-a432-74259bdf8770")
	)
	(wire
		(pts
			(xy 26.67 223.52) (xy 26.67 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "38a96f65-7f9d-4e4a-83d8-b173e3d2be7b")
	)
	(wire
		(pts
			(xy 153.67 260.35) (xy 162.56 260.35)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "395e1036-d20e-4e74-ae67-c3a444198882")
	)
	(wire
		(pts
			(xy 167.64 200.66) (xy 167.64 213.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "395e9826-d754-4187-9f1d-5500eb66271b")
	)
	(wire
		(pts
			(xy 44.45 234.95) (xy 44.45 219.71)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3acc72e4-11d4-442d-999e-a59c17de50aa")
	)
	(wire
		(pts
			(xy 354.33 93.98) (xy 374.65 93.98)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3c40d905-90a6-49c5-853b-28cd9572a79d")
	)
	(wire
		(pts
			(xy 167.64 213.36) (xy 153.67 213.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3c9b9dd2-504a-4f65-92bf-d194c411c566")
	)
	(wire
		(pts
			(xy 245.11 33.02) (xy 247.65 33.02)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3ccfa6b8-9f31-4866-9650-1dd96f81c0d9")
	)
	(wire
		(pts
			(xy 372.11 52.07) (xy 363.22 52.07)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3d365d48-cbf5-4630-8292-39ad7bb18ffd")
	)
	(wire
		(pts
			(xy 354.33 88.9) (xy 358.14 88.9)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3d8ed064-f397-41fc-b960-5a156cd52b0e")
	)
	(wire
		(pts
			(xy 382.27 104.14) (xy 354.33 104.14)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3e108f75-fa0d-4f2f-bdcb-16110c9ea667")
	)
	(wire
		(pts
			(xy 111.76 257.81) (xy 111.76 261.62)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3ea2222b-08d7-4efe-ba39-7a4f77271315")
	)
	(wire
		(pts
			(xy 308.61 78.74) (xy 321.31 78.74)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "3f38efd6-6e38-4fd4-be7e-acb2c83f5fea")
	)
	(wire
		(pts
			(xy 220.98 189.23) (xy 220.98 186.69)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "407d2aed-9107-465c-9dc1-ef75829f9bcd")
	)
	(wire
		(pts
			(xy 328.93 185.42) (xy 325.12 185.42)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "413e7463-9018-450b-b2af-be8bc0d1d2ef")
	)
	(wire
		(pts
			(xy 358.14 106.68) (xy 354.33 106.68)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "41ba2241-db30-467e-9464-0663d8145599")
	)
	(wire
		(pts
			(xy 179.07 135.89) (xy 179.07 138.43)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4357c34b-dcdc-4c66-a543-2927ca0febf5")
	)
	(wire
		(pts
			(xy 297.18 68.58) (xy 297.18 69.85)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "44c681b7-de21-46de-aac5-c4900787264b")
	)
	(wire
		(pts
			(xy 350.52 29.21) (xy 350.52 34.29)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "44d3ae65-d749-464d-a10a-31974d39e52d")
	)
	(wire
		(pts
			(xy 143.51 276.86) (xy 167.64 276.86)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "44f80889-dfde-4dcd-966a-0791cd257b7e")
	)
	(wire
		(pts
			(xy 119.38 121.92) (xy 140.97 121.92)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "457466b2-3c5b-4c3d-9d42-b6bb15f9a3ab")
	)
	(wire
		(pts
			(xy 359.41 229.87) (xy 370.84 229.87)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4964a201-04bd-4feb-b913-e4b36c3ca7da")
	)
	(wire
		(pts
			(xy 236.22 120.65) (xy 237.49 120.65)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "49b38fb1-ebf3-4116-b6b1-0719326f3e41")
	)
	(wire
		(pts
			(xy 88.9 260.35) (xy 96.52 260.35)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4bbac04d-4e47-4957-91d6-6f30d12da126")
	)
	(wire
		(pts
			(xy 288.29 62.23) (xy 290.83 62.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4bd741a8-2404-476a-a1e6-7dea524a5334")
	)
	(wire
		(pts
			(xy 36.83 109.22) (xy 29.21 109.22)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4c535ee1-c094-43b2-b867-39a08c2b6b40")
	)
	(wire
		(pts
			(xy 44.45 219.71) (xy 48.26 219.71)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4cc6d9e1-8a60-4e84-a1be-493257615859")
	)
	(wire
		(pts
			(xy 342.9 29.21) (xy 336.55 29.21)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4cfc2884-1c99-452d-8ef7-c01551a0e0c8")
	)
	(wire
		(pts
			(xy 81.28 270.51) (xy 81.28 273.05)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4d03b1a4-6bdb-4ebc-84ea-b82956c393c1")
	)
	(wire
		(pts
			(xy 290.83 96.52) (xy 321.31 96.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4e925e09-fe3e-497b-b915-b6b6df912be3")
	)
	(wire
		(pts
			(xy 139.7 214.63) (xy 139.7 212.09)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4ebc8d8b-9d36-4889-827c-08e395e87b21")
	)
	(wire
		(pts
			(xy 208.28 264.16) (xy 208.28 262.89)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4f0aeb4b-8bde-4797-a460-059cd73c1074")
	)
	(wire
		(pts
			(xy 251.46 180.34) (xy 248.92 180.34)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4f48b6c7-1d6d-438d-99fb-f271b6332d3a")
	)
	(wire
		(pts
			(xy 266.7 66.04) (xy 266.7 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4f6ac139-7f01-459e-a0de-5eedc7d73379")
	)
	(wire
		(pts
			(xy 382.27 101.6) (xy 354.33 101.6)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "4f9f8c19-55f5-4a5a-babd-cbda5fa1cdb6")
	)
	(wire
		(pts
			(xy 26.67 210.82) (xy 26.67 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "50024fc2-98df-4035-90f1-5d89539ac79f")
	)
	(wire
		(pts
			(xy 372.11 54.61) (xy 372.11 52.07)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "50a58fab-c2e9-45db-a873-78cbe46d8994")
	)
	(wire
		(pts
			(xy 134.62 50.8) (xy 128.27 50.8)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "524a7368-d16a-4648-a0e5-b293e2becf14")
	)
	(wire
		(pts
			(xy 143.51 276.86) (xy 143.51 280.67)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "526cf009-3c26-47a7-9f93-52d65b5120ab")
	)
	(wire
		(pts
			(xy 334.01 121.92) (xy 334.01 123.19)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "531a1a28-48ed-4c81-825f-268fbde80ec6")
	)
	(wire
		(pts
			(xy 288.29 72.39) (xy 290.83 72.39)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "539b0e72-408b-42ff-8c0b-812dadd4e345")
	)
	(wire
		(pts
			(xy 308.61 68.58) (xy 321.31 68.58)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "53d98f1e-ba0b-4678-abcd-d3e267253109")
	)
	(wire
		(pts
			(xy 318.77 170.18) (xy 318.77 175.26)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5526bee8-e589-4f1c-86fe-133f6b5fa8fd")
	)
	(wire
		(pts
			(xy 359.41 224.79) (xy 361.95 224.79)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "553b936e-915e-4aca-9216-13f1e822c3f0")
	)
	(wire
		(pts
			(xy 36.83 214.63) (xy 39.37 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "55ec08a2-fff1-4e80-97eb-3e569a348a4f")
	)
	(polyline
		(pts
			(xy 191.77 284.48) (xy 193.04 284.48)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "5622554c-8840-4212-a2a5-07da5a8c96f0")
	)
	(wire
		(pts
			(xy 31.75 91.44) (xy 36.83 91.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "566fffd0-b6a8-4c39-ac30-ea4a5737422b")
	)
	(wire
		(pts
			(xy 157.48 248.92) (xy 157.48 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "570038d6-fdea-4f83-b070-afdbe15b590f")
	)
	(wire
		(pts
			(xy 147.32 248.92) (xy 157.48 248.92)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "585df61d-a8dd-448e-99bc-8969d3a29438")
	)
	(wire
		(pts
			(xy 356.87 222.25) (xy 339.09 222.25)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "58621d42-d93e-4fe3-b642-2ad55d44da28")
	)
	(wire
		(pts
			(xy 172.72 200.66) (xy 167.64 200.66)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5a8342cb-b576-47e0-b298-b5f221430a13")
	)
	(wire
		(pts
			(xy 237.49 120.65) (xy 237.49 121.92)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5a8bde1c-6430-4ece-8580-fac69e79f58a")
	)
	(wire
		(pts
			(xy 303.53 64.77) (xy 300.99 64.77)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5ae4b91f-6332-461f-b6f5-7a00c1d208a0")
	)
	(wire
		(pts
			(xy 339.09 229.87) (xy 355.6 229.87)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5b7cb8fe-5470-4bc4-abe6-9a824d1399fb")
	)
	(wire
		(pts
			(xy 182.88 271.78) (xy 182.88 276.86)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5b8b67c2-9e95-483f-ad4b-8c1fe0d4ed8b")
	)
	(wire
		(pts
			(xy 391.16 224.79) (xy 391.16 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5b95d5b7-729c-411e-99bf-c42bfbf4ad9f")
	)
	(wire
		(pts
			(xy 172.72 214.63) (xy 172.72 212.09)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5bde0aa4-f390-4811-8180-7e5749c2421e")
	)
	(wire
		(pts
			(xy 270.51 60.96) (xy 270.51 63.5)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5bf3c169-0a84-4efa-a608-4d58b6659bc3")
	)
	(wire
		(pts
			(xy 72.39 218.44) (xy 68.58 218.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5c599bc3-abe2-4af9-8f27-e489fedbf84e")
	)
	(wire
		(pts
			(xy 172.72 224.79) (xy 172.72 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5d3d4db1-9fe8-4d18-b5a0-ca7362fb28cb")
	)
	(wire
		(pts
			(xy 139.7 203.2) (xy 125.73 203.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5d7a2ea4-6fd5-42f9-a56a-50cfc0acebee")
	)
	(wire
		(pts
			(xy 78.74 33.02) (xy 91.44 33.02)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5e720f49-2bcb-44f3-bd6f-7ef5be13d654")
	)
	(wire
		(pts
			(xy 370.84 234.95) (xy 374.65 234.95)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "5ede68da-4799-4f63-acbd-7d897e31c77c")
	)
	(wire
		(pts
			(xy 359.41 222.25) (xy 359.41 224.79)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6082282d-8371-407b-bd36-e046067ec83f")
	)
	(wire
		(pts
			(xy 303.53 63.5) (xy 303.53 64.77)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "608c24e2-5834-48ef-8c9a-e3ee89b3cedb")
	)
	(wire
		(pts
			(xy 119.38 119.38) (xy 119.38 121.92)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "60dac862-5394-4a6f-be92-99b476b12b7e")
	)
	(wire
		(pts
			(xy 101.6 80.01) (xy 101.6 83.82)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "61130f3c-8e10-48e5-b869-269c08cd5d9c")
	)
	(wire
		(pts
			(xy 66.04 260.35) (xy 73.66 260.35)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "63ac96c1-b598-49db-b549-daa0748c3989")
	)
	(wire
		(pts
			(xy 85.09 214.63) (xy 85.09 218.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "63bde867-27aa-4c79-ae1b-f9fa79173134")
	)
	(wire
		(pts
			(xy 179.07 127) (xy 163.83 127)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "63e96997-1b65-4679-b50e-5e405d452d45")
	)
	(wire
		(pts
			(xy 336.55 123.19) (xy 339.09 123.19)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "640d5c14-cd84-4b57-9ab2-88099b832d38")
	)
	(wire
		(pts
			(xy 228.6 179.07) (xy 238.76 179.07)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6491c0e8-564a-499f-87e9-46a19e1bc9ef")
	)
	(wire
		(pts
			(xy 111.76 269.24) (xy 111.76 276.86)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "649b70b8-6d56-4be3-bd66-6729d6312bf1")
	)
	(wire
		(pts
			(xy 339.09 39.37) (xy 336.55 39.37)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6554a88a-8265-46fa-a55e-47dd6aedc9c0")
	)
	(wire
		(pts
			(xy 321.31 55.88) (xy 308.61 55.88)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "65567485-e8bf-4c32-ab88-7345ae997884")
	)
	(wire
		(pts
			(xy 26.67 215.9) (xy 26.67 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "65fe469a-04ca-4962-92f0-5be8b8ba9a60")
	)
	(wire
		(pts
			(xy 26.67 226.06) (xy 36.83 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6600460a-3e3c-42fd-a312-aa4e83c483fe")
	)
	(wire
		(pts
			(xy 354.33 99.06) (xy 358.14 99.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "663e42bb-e868-4ea2-820e-b3a7591ec2fd")
	)
	(wire
		(pts
			(xy 217.17 57.15) (xy 220.98 57.15)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "667cf74f-c089-44ea-9a63-f6ed5c8966a3")
	)
	(wire
		(pts
			(xy 363.22 29.21) (xy 363.22 31.75)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "668d58c2-6037-47cc-b63c-fcfe6f74b9d1")
	)
	(polyline
		(pts
			(xy 12.7 241.3) (xy 227.33 241.3)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "67a56a48-788e-4022-b5f3-0512cfd9e465")
	)
	(wire
		(pts
			(xy 179.07 138.43) (xy 177.8 138.43)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "67f58e7c-8932-4552-aa1c-af7d453d272a")
	)
	(wire
		(pts
			(xy 58.42 226.06) (xy 67.31 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6adb3d2a-5a76-46ff-a2c0-f6fe11ec1393")
	)
	(wire
		(pts
			(xy 172.72 48.26) (xy 172.72 50.8)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6b2b2a94-cf47-4f96-ac76-9298561ba8f2")
	)
	(wire
		(pts
			(xy 36.83 106.68) (xy 29.21 106.68)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6b33dc20-f51a-4142-86c2-e423a2d4cdea")
	)
	(wire
		(pts
			(xy 321.31 91.44) (xy 308.61 91.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6b689741-c85c-4f2b-9443-bb9f03c3b36e")
	)
	(wire
		(pts
			(xy 133.35 91.44) (xy 139.7 91.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6b70b1ef-d9df-405a-8b85-bb99290a50ff")
	)
	(wire
		(pts
			(xy 182.88 256.54) (xy 182.88 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6cb21174-844a-4e5b-b9f0-94e1cc415a5e")
	)
	(wire
		(pts
			(xy 304.165 62.23) (xy 306.07 62.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6cfcfa96-a19c-448c-8735-081737f8dbf2")
	)
	(wire
		(pts
			(xy 78.74 58.42) (xy 83.82 58.42)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6da5d4ec-d40a-4e19-a561-42c3599efcee")
	)
	(wire
		(pts
			(xy 347.98 29.21) (xy 350.52 29.21)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6e0f465e-7b7b-476a-a66a-cc99a9d02f01")
	)
	(wire
		(pts
			(xy 299.72 68.58) (xy 303.53 68.58)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "6f5802da-7532-4d55-831b-7e5033c7963c")
	)
	(wire
		(pts
			(xy 247.65 33.02) (xy 247.65 34.29)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "707f97ea-2135-44cd-b5db-c0f12580521f")
	)
	(wire
		(pts
			(xy 354.33 172.72) (xy 353.06 172.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7134fbc6-245f-4fff-938e-df296cd8c25b")
	)
	(wire
		(pts
			(xy 323.85 170.18) (xy 323.85 172.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7187810a-65e0-41ca-b389-efc494147312")
	)
	(wire
		(pts
			(xy 133.35 262.89) (xy 123.19 262.89)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "71ad9b06-8336-4918-ae39-a17881f4d868")
	)
	(wire
		(pts
			(xy 20.32 279.4) (xy 20.32 276.86)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "71f3c694-230e-48dd-bc65-be14c16c51fd")
	)
	(wire
		(pts
			(xy 123.19 143.51) (xy 123.19 142.24)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "72309ce9-fb84-4a7a-8067-c41ecb9eb0a8")
	)
	(wire
		(pts
			(xy 303.53 68.58) (xy 303.53 71.12)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "72651e17-5685-4183-9540-a9a1207f9be6")
	)
	(wire
		(pts
			(xy 80.01 45.72) (xy 78.74 45.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "732c1476-69b5-404c-af0b-82ee721cb6d1")
	)
	(wire
		(pts
			(xy 101.6 83.82) (xy 92.71 83.82)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "735bb110-f96c-4ac0-956a-5a08049378f1")
	)
	(wire
		(pts
			(xy 135.89 213.36) (xy 153.67 213.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "74fce67b-2cde-4420-9b45-1a8fa07684bf")
	)
	(wire
		(pts
			(xy 179.07 50.8) (xy 179.07 48.26)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7572f2cf-75eb-4d95-ac05-55640fc42580")
	)
	(wire
		(pts
			(xy 68.58 214.63) (xy 85.09 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "759a1f44-c85a-4a16-9c70-6167d1022c48")
	)
	(wire
		(pts
			(xy 162.56 265.43) (xy 162.56 266.7)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "75f08824-9892-4311-b93a-6e91e17c777e")
	)
	(wire
		(pts
			(xy 290.83 62.23) (xy 297.815 62.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "76ac9c1d-c9fb-40a0-b223-8868d11e2aab")
	)
	(wire
		(pts
			(xy 336.55 29.21) (xy 336.55 39.37)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "76d00194-b936-4fa5-b435-bb83b05ddf49")
	)
	(wire
		(pts
			(xy 359.41 227.33) (xy 361.95 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "76e7c316-7bb0-469f-ac5e-bb4cce10c061")
	)
	(wire
		(pts
			(xy 46.99 214.63) (xy 48.26 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "77d19c2d-9215-4231-8311-7e2d5e02bcdd")
	)
	(wire
		(pts
			(xy 119.38 124.46) (xy 140.97 124.46)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "783fe8c0-af55-4d10-8b7f-a0c1ca90fbf5")
	)
	(wire
		(pts
			(xy 205.74 38.1) (xy 209.55 38.1)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7862c359-9cd1-492e-93ee-99cb0e7ce33f")
	)
	(wire
		(pts
			(xy 83.82 58.42) (xy 83.82 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "78d7d2a3-0663-457d-9a91-b6d5c11bbcb5")
	)
	(wire
		(pts
			(xy 46.99 267.97) (xy 46.99 270.51)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "78f7a3b7-4041-4fc8-9d0d-5aa104906342")
	)
	(wire
		(pts
			(xy 165.1 43.18) (xy 173.99 43.18)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7949a4fd-d960-4f5a-8189-ad521606b2ad")
	)
	(wire
		(pts
			(xy 217.17 60.96) (xy 217.17 57.15)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7a5b889d-d345-422f-b153-59db8d85495e")
	)
	(wire
		(pts
			(xy 391.16 234.95) (xy 374.65 234.95)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7a809d7a-234d-4bd1-bbfe-04c4bb328621")
	)
	(wire
		(pts
			(xy 308.61 81.28) (xy 321.31 81.28)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7c18d039-1bb0-4ab6-9157-e29b3bef7230")
	)
	(wire
		(pts
			(xy 297.18 69.85) (xy 295.91 69.85)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7c6c6838-3dc3-406f-9b94-6edff96a3e24")
	)
	(wire
		(pts
			(xy 236.22 81.28) (xy 236.22 80.01)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7de6c98a-8886-45c9-b94f-fc15dae64fa8")
	)
	(wire
		(pts
			(xy 391.16 226.06) (xy 391.16 228.6)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7e40b5d8-9de0-4e00-9f90-16537cdcdb2b")
	)
	(wire
		(pts
			(xy 236.22 171.45) (xy 248.92 171.45)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7f687126-fcd0-4753-b00c-904d0f47097e")
	)
	(wire
		(pts
			(xy 328.93 182.88) (xy 325.12 182.88)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "7f81847c-43d2-4ad8-b261-3a565b2f1e1d")
	)
	(wire
		(pts
			(xy 336.55 39.37) (xy 336.55 45.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "81c01991-1d7e-413e-9b88-5e7cc06b6a97")
	)
	(wire
		(pts
			(xy 303.53 73.66) (xy 303.53 76.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "82a376b1-4428-4013-83b6-f27655e64ffe")
	)
	(wire
		(pts
			(xy 363.22 44.45) (xy 363.22 46.99)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "832988d5-080a-4ae9-8770-c560a8c483be")
	)
	(wire
		(pts
			(xy 228.6 181.61) (xy 238.76 181.61)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "83ebcba0-5f83-4f2f-a224-431e3e6a3f06")
	)
	(wire
		(pts
			(xy 110.49 227.33) (xy 125.73 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8463aba2-a999-4a01-9f5d-6eac14a8abb6")
	)
	(wire
		(pts
			(xy 353.06 180.34) (xy 349.25 180.34)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "85182707-4949-4961-a371-9bc914927ccc")
	)
	(wire
		(pts
			(xy 236.22 190.5) (xy 236.22 189.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "858c3b0b-bc3d-465d-abcc-5201efd73807")
	)
	(wire
		(pts
			(xy 358.14 116.84) (xy 354.33 116.84)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "858e6e1c-5c3a-4c97-b12a-5f594a7d0d1d")
	)
	(wire
		(pts
			(xy 227.33 118.11) (xy 227.33 120.65)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8617be03-96da-4e02-9226-91fa991885ff")
	)
	(wire
		(pts
			(xy 391.16 217.17) (xy 391.16 219.71)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "878fcd73-9c29-4f8c-b60c-d48ac72e9a2c")
	)
	(wire
		(pts
			(xy 262.89 66.04) (xy 266.7 66.04)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "882edcf9-6fa2-4c8b-b885-d7fcdb0586dc")
	)
	(wire
		(pts
			(xy 153.67 227.33) (xy 125.73 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "89bef556-8395-4d21-8769-5f485d6e1e5f")
	)
	(wire
		(pts
			(xy 391.16 233.68) (xy 391.16 234.95)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8a370329-da47-4151-9dc6-2393ed273775")
	)
	(wire
		(pts
			(xy 217.17 60.96) (xy 217.17 64.77)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8a37da14-37da-44eb-aa26-324dc8181a5c")
	)
	(wire
		(pts
			(xy 299.72 229.87) (xy 299.72 231.14)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8a8a119a-f84e-48d9-9855-9e33400fd144")
	)
	(wire
		(pts
			(xy 91.44 30.48) (xy 91.44 27.94)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8b259108-9cda-4fef-8908-b989ad696ba5")
	)
	(wire
		(pts
			(xy 339.09 39.37) (xy 339.09 45.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8b34af14-cbb7-43d8-a760-76dc80da86f9")
	)
	(wire
		(pts
			(xy 273.05 36.83) (xy 273.05 35.56)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8bc1fdbe-de89-4de0-8baa-f27a72820dab")
	)
	(wire
		(pts
			(xy 163.83 138.43) (xy 162.56 138.43)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8ce607d0-4f3b-4b44-9df8-c9e10341e59d")
	)
	(wire
		(pts
			(xy 334.01 123.19) (xy 336.55 123.19)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8d365c5d-01b6-44f1-b89a-3b64d13a0a59")
	)
	(wire
		(pts
			(xy 96.52 259.08) (xy 96.52 260.35)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8da85892-a503-46db-8230-64d7806e6742")
	)
	(wire
		(pts
			(xy 29.21 104.14) (xy 36.83 104.14)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8dbc4692-f007-47d9-89fe-0de0733a175a")
	)
	(wire
		(pts
			(xy 344.17 44.45) (xy 363.22 44.45)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8ea6b69f-3f9d-41f0-ae35-e4cb799a0d3f")
	)
	(wire
		(pts
			(xy 303.53 62.23) (xy 304.165 62.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8f1c02ea-9c5b-49f4-8917-0811c62657a1")
	)
	(wire
		(pts
			(xy 339.09 224.79) (xy 359.41 224.79)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8f5307df-1103-4b6e-bdcc-4c17f28ec38c")
	)
	(wire
		(pts
			(xy 274.32 180.34) (xy 271.78 180.34)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "8fc3f810-fa6d-412f-b752-bf6e51fb8e09")
	)
	(wire
		(pts
			(xy 162.56 266.7) (xy 167.64 266.7)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "9267001e-9ef8-49cd-99c8-6a7d3284e672")
	)
	(wire
		(pts
			(xy 110.49 219.71) (xy 110.49 218.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "92706610-d4c4-4882-836b-af51451b3bf9")
	)
	(wire
		(pts
			(xy 91.44 25.4) (xy 91.44 27.94)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "9394af8a-8ebf-42ba-80f9-c556da57614a")
	)
	(wire
		(pts
			(xy 308.61 50.8) (xy 321.31 50.8)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "93cf7bfe-63e5-4a5a-852d-a78194a1aa58")
	)
	(wire
		(pts
			(xy 81.28 273.05) (xy 96.52 273.05)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "9461e286-979e-438f-b11f-5f79fa675b56")
	)
	(wire
		(pts
			(xy 336.55 123.19) (xy 336.55 125.73)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "947328bd-27ff-4a2e-8941-34b69e7488e4")
	)
	(wire
		(pts
			(xy 208.28 252.73) (xy 208.28 255.27)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "950e6109-6bf8-4553-a099-2e28c591f5b4")
	)
	(wire
		(pts
			(xy 251.46 60.96) (xy 255.27 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "956a0059-ac74-4e56-aa6b-0b7fa1f84aec")
	)
	(wire
		(pts
			(xy 29.21 267.97) (xy 34.29 267.97)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "95e4c803-dc8e-4645-9685-834e16d00373")
	)
	(wire
		(pts
			(xy 90.17 45.72) (xy 87.63 45.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "96f3c622-5a25-4231-9cfd-0c05aa2da96d")
	)
	(wire
		(pts
			(xy 128.27 257.81) (xy 111.76 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "97eb529a-9897-4169-8f10-0c0642013a22")
	)
	(wire
		(pts
			(xy 29.21 38.1) (xy 33.02 38.1)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "98048fcd-fc31-4195-b0ae-216317a1cd9d")
	)
	(wire
		(pts
			(xy 20.32 267.97) (xy 21.59 267.97)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "9810b0a7-b8e6-4de4-b247-d076a1d34da5")
	)
	(wire
		(pts
			(xy 218.44 186.69) (xy 218.44 189.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "98aef0ca-1376-4ca3-b508-7bfd202a1541")
	)
	(wire
		(pts
			(xy 290.83 93.98) (xy 290.83 96.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "98b5f6d8-7247-4c46-b1dc-1422050d4962")
	)
	(polyline
		(pts
			(xy 104.14 185.42) (xy 104.14 284.48)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "994b4abf-5cfe-4ebe-af16-35e42a1d4f1d")
	)
	(wire
		(pts
			(xy 303.53 63.5) (xy 321.31 63.5)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "99be1447-89b4-4f1d-86c0-f95a58ee6c1d")
	)
	(wire
		(pts
			(xy 347.98 219.71) (xy 353.06 219.71)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "99cdbc9a-7a7c-452a-91f9-4ad3ff850d57")
	)
	(wire
		(pts
			(xy 91.44 27.94) (xy 78.74 27.94)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "9af0dc6f-c142-434c-87ab-f50395e91dd6")
	)
	(wire
		(pts
			(xy 213.36 80.01) (xy 223.52 80.01)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "9dc4bbc2-f9a5-4519-bd11-ee0c4ffa5466")
	)
	(polyline
		(pts
			(xy 12.7 185.42) (xy 12.7 186.69)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "9ffcc209-131b-4c80-8db1-96291396beb6")
	)
	(wire
		(pts
			(xy 182.88 264.16) (xy 182.88 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a03b77ea-9873-4c71-b232-7e120c7f027a")
	)
	(polyline
		(pts
			(xy 191.77 137.16) (xy 407.67 137.16)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "a0690e32-6373-4b70-b651-41760ee943ae")
	)
	(wire
		(pts
			(xy 358.14 83.82) (xy 354.33 83.82)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a0c252d6-0259-49f5-95a7-6b3964888c57")
	)
	(wire
		(pts
			(xy 303.53 60.96) (xy 303.53 59.69)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a0f6b963-7bac-4fde-b2dc-e51ba1ff6dd3")
	)
	(wire
		(pts
			(xy 298.45 106.68) (xy 321.31 106.68)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a17114b9-70df-4633-a041-2665686cbfcb")
	)
	(wire
		(pts
			(xy 166.37 91.44) (xy 161.29 91.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a18b4b87-4468-4024-bd4a-2ac1c026e183")
	)
	(wire
		(pts
			(xy 133.35 257.81) (xy 128.27 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a2666ce2-f37f-4be0-81be-0311c3d44caa")
	)
	(wire
		(pts
			(xy 20.32 259.08) (xy 20.32 267.97)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a28ca53f-f871-4b26-8aea-2cfbd1c51a8e")
	)
	(wire
		(pts
			(xy 342.9 34.29) (xy 339.09 34.29)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a2a67cbc-7cb5-4561-a210-61cc86c3701c")
	)
	(wire
		(pts
			(xy 167.64 227.33) (xy 172.72 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a2b9f0f0-7809-43dc-bafb-f3ad653875c2")
	)
	(wire
		(pts
			(xy 336.55 123.19) (xy 336.55 121.92)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a2befbfd-c79b-4d10-a436-28280f6bfad8")
	)
	(wire
		(pts
			(xy 125.73 227.33) (xy 125.73 223.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a37c244b-1e91-4325-a102-4b59d974944a")
	)
	(wire
		(pts
			(xy 354.33 78.74) (xy 358.14 78.74)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a37f824f-1343-4a3b-bda5-aea3271c513a")
	)
	(wire
		(pts
			(xy 128.27 40.64) (xy 134.62 40.64)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a5b7f9cd-0fc4-4a41-857f-624b48d72f28")
	)
	(wire
		(pts
			(xy 246.38 60.96) (xy 251.46 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a6a6fa4f-4efc-4041-99f2-2eda96984fd4")
	)
	(wire
		(pts
			(xy 354.33 86.36) (xy 358.14 86.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a7014884-d2f4-470f-9cb5-a7904991df33")
	)
	(wire
		(pts
			(xy 317.5 111.76) (xy 321.31 111.76)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a7c4f789-1787-4d5f-aa1f-7bc158d9d74d")
	)
	(wire
		(pts
			(xy 36.83 119.38) (xy 29.21 119.38)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a94b5beb-d126-493e-8138-0299ab94d100")
	)
	(wire
		(pts
			(xy 370.84 229.87) (xy 370.84 234.95)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "a9963d1d-cc17-41f4-a5be-beed9b42005e")
	)
	(wire
		(pts
			(xy 153.67 224.79) (xy 153.67 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "aa8ecca5-fad3-4faf-83a0-42224288cd1c")
	)
	(wire
		(pts
			(xy 139.7 204.47) (xy 139.7 203.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ac104c73-ae9f-4743-9254-29457b4bee95")
	)
	(wire
		(pts
			(xy 147.32 96.52) (xy 151.13 96.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ac295009-470c-4ce4-92ce-8290e442ca59")
	)
	(wire
		(pts
			(xy 66.04 264.16) (xy 66.04 262.89)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ac8a1b75-358b-42e6-92fe-ca40cf286095")
	)
	(wire
		(pts
			(xy 257.81 66.04) (xy 251.46 66.04)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "acd4f8af-5441-4ead-ae51-172bd908aa26")
	)
	(wire
		(pts
			(xy 358.14 96.52) (xy 354.33 96.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ae6e36ac-d889-405b-a23f-523994b554ed")
	)
	(wire
		(pts
			(xy 212.09 105.41) (xy 214.63 105.41)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "aecdbbaf-6b9c-4f7a-82c7-b3b5e3d661c2")
	)
	(wire
		(pts
			(xy 163.83 135.89) (xy 163.83 138.43)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "af58f394-d5e9-4763-b9f0-ead043f5c795")
	)
	(wire
		(pts
			(xy 20.32 269.24) (xy 20.32 267.97)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "afaa1ae8-d96e-40ee-9700-5d095e1762d8")
	)
	(wire
		(pts
			(xy 123.19 153.67) (xy 123.19 152.4)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "affb011d-a4b0-492f-83fb-23a0259be69c")
	)
	(wire
		(pts
			(xy 36.83 99.06) (xy 29.21 99.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b06c01fe-9bf3-4109-8f3e-4d2c7ba12166")
	)
	(wire
		(pts
			(xy 308.61 83.82) (xy 321.31 83.82)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b0a0905b-d76e-4b56-a910-1888709eeebc")
	)
	(wire
		(pts
			(xy 179.07 50.8) (xy 179.07 52.07)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b0ae8ad1-800e-4447-9b43-9f009a594702")
	)
	(wire
		(pts
			(xy 101.6 83.82) (xy 106.68 83.82)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b0af77d3-aa45-4b8b-8e39-a53a37dae003")
	)
	(wire
		(pts
			(xy 110.49 218.44) (xy 115.57 218.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b10a9ae7-21c0-4a65-8199-fc77e2aab20b")
	)
	(wire
		(pts
			(xy 372.11 44.45) (xy 372.11 46.99)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b13a2981-4d57-499f-b61f-12490f6c0298")
	)
	(wire
		(pts
			(xy 247.65 30.48) (xy 245.11 30.48)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b2f1f9ef-2a9d-4c8e-aede-fe3e0a3f97c0")
	)
	(wire
		(pts
			(xy 172.72 45.72) (xy 172.72 48.26)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b3b22e84-fbc2-45f7-a365-b753d8a31ecd")
	)
	(wire
		(pts
			(xy 147.32 91.44) (xy 151.13 91.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b3e75f30-d8c6-4d14-a72c-191568726b08")
	)
	(wire
		(pts
			(xy 354.33 81.28) (xy 358.14 81.28)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b4392f71-3099-416e-8492-0c0baab5ff8c")
	)
	(wire
		(pts
			(xy 236.22 168.91) (xy 236.22 171.45)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b4db62b7-4615-4043-83c5-c00af1dd85a2")
	)
	(wire
		(pts
			(xy 308.61 101.6) (xy 321.31 101.6)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b5f364ed-5b5d-494d-a76c-d353d1f87d04")
	)
	(wire
		(pts
			(xy 172.72 227.33) (xy 184.15 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b6262c0f-dc7c-4b12-9ae0-de3c2fc7da46")
	)
	(wire
		(pts
			(xy 295.91 59.69) (xy 300.99 59.69)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b6720445-837c-4cae-9227-89a30eadc9a7")
	)
	(wire
		(pts
			(xy 140.97 116.84) (xy 133.35 116.84)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b6b9b0d8-6d9f-417c-823a-3c55ae942135")
	)
	(wire
		(pts
			(xy 167.64 229.87) (xy 167.64 227.33)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b737c3f6-ad5d-4a84-86a6-07e39b2547d7")
	)
	(wire
		(pts
			(xy 370.84 217.17) (xy 370.84 222.25)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b768e990-f25d-4eb7-9215-fe4e58767513")
	)
	(wire
		(pts
			(xy 153.67 213.36) (xy 153.67 217.17)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b797fb35-94ff-476c-be05-edac8413e159")
	)
	(wire
		(pts
			(xy 133.35 86.36) (xy 139.7 86.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b9404a58-adff-4bcf-b7af-598512d630a5")
	)
	(wire
		(pts
			(xy 66.04 262.89) (xy 73.66 262.89)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b94b6b45-53f2-4993-bd6a-7b9ba7394ab7")
	)
	(wire
		(pts
			(xy 34.29 267.97) (xy 34.29 264.16)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b95df3d1-5c21-4c48-98a1-5d436efc096e")
	)
	(wire
		(pts
			(xy 66.04 269.24) (xy 66.04 273.05)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "b9bad655-708f-4582-8967-49076f196e74")
	)
	(wire
		(pts
			(xy 234.95 92.71) (xy 227.33 92.71)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "baa9f866-b5a9-4142-a7d1-04f708d4ce51")
	)
	(wire
		(pts
			(xy 228.6 80.01) (xy 236.22 80.01)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "bb492bd1-6906-481a-8223-6f263d639e55")
	)
	(wire
		(pts
			(xy 162.56 260.35) (xy 162.56 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "bd2159a7-b539-4bf6-9f9b-8746e2267d32")
	)
	(wire
		(pts
			(xy 205.74 27.94) (xy 209.55 27.94)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "bd8bc16d-3e89-4d49-9905-0b5ffbfa2e3e")
	)
	(wire
		(pts
			(xy 273.05 45.72) (xy 273.05 44.45)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "bdc7f7c1-42b0-4d3e-97ec-c7783d6890c3")
	)
	(wire
		(pts
			(xy 353.06 182.88) (xy 349.25 182.88)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "be92a9e4-a946-4c75-9d95-d8df3715a4dd")
	)
	(wire
		(pts
			(xy 123.19 161.29) (xy 123.19 163.83)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "bf233fa4-c4f4-4cff-bab7-4b3b1e77cb01")
	)
	(wire
		(pts
			(xy 350.52 34.29) (xy 350.52 39.37)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "bf9ac35f-e642-4459-a7e8-e61ca52a2b7b")
	)
	(wire
		(pts
			(xy 229.87 64.77) (xy 236.22 64.77)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c003d0d9-c707-4c66-a264-a41212f43aeb")
	)
	(wire
		(pts
			(xy 339.09 219.71) (xy 340.36 219.71)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c1638284-febc-40b3-aa6b-20099699243b")
	)
	(wire
		(pts
			(xy 167.64 266.7) (xy 167.64 267.97)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c1b286a5-ff51-4b4b-946b-fbb7ecefabe3")
	)
	(wire
		(pts
			(xy 166.37 88.9) (xy 166.37 91.44)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c2ac4c91-b2d4-4751-a4a9-b7de5dc5878a")
	)
	(wire
		(pts
			(xy 363.22 44.45) (xy 372.11 44.45)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c3d78b62-1364-4ea4-bee7-6b3dd725dd98")
	)
	(wire
		(pts
			(xy 119.38 152.4) (xy 123.19 152.4)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c3fdfe7b-3911-4460-aeb6-d475b730e1dc")
	)
	(wire
		(pts
			(xy 303.53 71.12) (xy 321.31 71.12)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c4c791dd-5c3f-4b40-a6f1-16d384ed70cf")
	)
	(wire
		(pts
			(xy 106.68 83.82) (xy 106.68 86.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c4e07daf-adef-4d92-9308-a525e180c90c")
	)
	(wire
		(pts
			(xy 321.31 60.96) (xy 303.53 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c55c8510-391f-414a-bda0-aac26df7402f")
	)
	(wire
		(pts
			(xy 36.83 222.25) (xy 36.83 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c62cccb2-eafb-4c32-b3c7-5860935b875e")
	)
	(wire
		(pts
			(xy 394.97 105.41) (xy 394.97 109.22)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c65c407a-f01a-498d-a209-aa8979cc48e4")
	)
	(wire
		(pts
			(xy 162.56 257.81) (xy 167.64 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c85b55f5-dafb-4631-9ba5-2ca7951f71d1")
	)
	(wire
		(pts
			(xy 214.63 110.49) (xy 212.09 110.49)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c88b9552-8a3d-4ba1-96c1-3a2b2c7ae60f")
	)
	(wire
		(pts
			(xy 224.79 120.65) (xy 227.33 120.65)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c88c7dd1-8487-475b-bfa1-d00e2c31fb8a")
	)
	(wire
		(pts
			(xy 77.47 226.06) (xy 80.01 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "c984c2cd-e3c2-4735-8d4d-036719d252ab")
	)
	(wire
		(pts
			(xy 213.36 60.96) (xy 217.17 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "cb293e54-2826-4b81-bff3-8c754705d6a8")
	)
	(wire
		(pts
			(xy 334.01 29.21) (xy 336.55 29.21)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "cb4e422b-c948-4ef8-81d3-d35283d1c492")
	)
	(wire
		(pts
			(xy 339.09 34.29) (xy 339.09 39.37)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "cbf2de2e-d283-4078-bf46-be2f52e0ab81")
	)
	(wire
		(pts
			(xy 20.32 252.73) (xy 20.32 259.08)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "cc4031f4-c153-43d7-93b1-cff825cceb1e")
	)
	(wire
		(pts
			(xy 334.01 29.21) (xy 334.01 45.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "cc5ea4e0-3bb2-4b98-b268-713fd50c3003")
	)
	(wire
		(pts
			(xy 359.41 227.33) (xy 359.41 229.87)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "cd1bef64-1688-45cb-afba-6cb86059a2b5")
	)
	(wire
		(pts
			(xy 394.97 97.79) (xy 394.97 96.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ce2eb428-8a5b-467e-82f4-464bd7b228df")
	)
	(wire
		(pts
			(xy 106.68 86.36) (xy 106.68 87.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ce3b9359-8efd-4313-85a4-a7e24aed596b")
	)
	(wire
		(pts
			(xy 179.07 128.27) (xy 179.07 127)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ce86cbd5-b11b-4fdb-a3bc-fc14bea82e19")
	)
	(wire
		(pts
			(xy 157.48 205.74) (xy 157.48 203.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ceb95b7e-830e-4bc5-995a-d088ff9a586f")
	)
	(wire
		(pts
			(xy 308.61 86.36) (xy 321.31 86.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "cf19423a-60d0-4e70-9e60-445de3c67ef9")
	)
	(wire
		(pts
			(xy 92.71 165.1) (xy 96.52 165.1)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "cfa0da81-651a-48bf-9391-cdd2ea82279a")
	)
	(wire
		(pts
			(xy 251.46 66.04) (xy 251.46 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d03926a4-5138-4697-86e0-455759d2d79c")
	)
	(wire
		(pts
			(xy 297.18 76.2) (xy 299.72 76.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d0d2c0b9-6a52-449e-8cc7-4659eeba5054")
	)
	(wire
		(pts
			(xy 217.17 64.77) (xy 222.25 64.77)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d12d6a1a-f5ea-4eaf-800b-aa5518e4e30d")
	)
	(wire
		(pts
			(xy 52.07 234.95) (xy 44.45 234.95)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d20b3035-76ee-4778-9d42-e1f40a239451")
	)
	(wire
		(pts
			(xy 220.98 189.23) (xy 236.22 189.23)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d21deef6-4176-4598-9ea1-a7ff94f070db")
	)
	(wire
		(pts
			(xy 66.04 256.54) (xy 66.04 260.35)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d28af819-cff7-430e-928c-d221b400068e")
	)
	(wire
		(pts
			(xy 123.19 152.4) (xy 123.19 151.13)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d322a3a2-42f6-4d62-a27f-28779b6e4328")
	)
	(wire
		(pts
			(xy 321.31 99.06) (xy 308.61 99.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d3256968-95d3-4f54-a905-2bc87eabd82b")
	)
	(wire
		(pts
			(xy 165.1 50.8) (xy 172.72 50.8)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d32ab692-dfc4-44da-91b9-00dd0dabe497")
	)
	(wire
		(pts
			(xy 179.07 39.37) (xy 179.07 40.64)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d4c86d11-e5a1-43a2-8c2b-525d358f50c2")
	)
	(wire
		(pts
			(xy 36.83 217.17) (xy 36.83 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d5db03c6-384e-4f1a-aa4e-83f229c3a500")
	)
	(wire
		(pts
			(xy 341.63 39.37) (xy 339.09 39.37)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d6c77054-803f-4a37-a068-34352051b209")
	)
	(wire
		(pts
			(xy 265.43 60.96) (xy 266.7 60.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d725379a-b7f3-4fe4-a5bb-da6a01cdd08b")
	)
	(wire
		(pts
			(xy 354.33 36.83) (xy 354.33 34.29)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d845e7b4-f2ce-405c-8cb6-8c4aa5ea5e35")
	)
	(wire
		(pts
			(xy 299.72 76.2) (xy 303.53 76.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "d8657980-b817-41c0-a451-a21d06df2d00")
	)
	(wire
		(pts
			(xy 139.7 224.79) (xy 139.7 222.25)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "da6b9120-1c58-40e2-9dcd-8867cb5402eb")
	)
	(wire
		(pts
			(xy 157.48 257.81) (xy 153.67 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "dad81740-8d55-42fe-ae64-bbca1a941d5d")
	)
	(wire
		(pts
			(xy 90.17 226.06) (xy 95.25 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "db1a73a7-7b63-4172-9bb4-09a5f983781e")
	)
	(wire
		(pts
			(xy 147.32 86.36) (xy 151.13 86.36)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "db507c15-ae04-46de-adee-11275cf93de3")
	)
	(wire
		(pts
			(xy 34.29 252.73) (xy 34.29 254)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "dcaad8bb-e9d2-4ba3-86a8-c83c21b390cb")
	)
	(wire
		(pts
			(xy 381 226.06) (xy 381 228.6)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "dcc1e012-b3f1-42aa-8107-dd3c54586fce")
	)
	(wire
		(pts
			(xy 167.64 257.81) (xy 182.88 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ddee2027-0ef3-418b-adc0-93b97f4920e3")
	)
	(wire
		(pts
			(xy 135.89 224.79) (xy 139.7 224.79)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "de31c8e8-d47c-4aa2-9a56-3d7148922db5")
	)
	(wire
		(pts
			(xy 205.74 35.56) (xy 209.55 35.56)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "de57ddef-bace-4c67-81d1-9e3a17ff137d")
	)
	(wire
		(pts
			(xy 350.52 39.37) (xy 347.98 39.37)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "e028e00b-589d-4663-9197-bc2a5d171343")
	)
	(wire
		(pts
			(xy 299.72 220.98) (xy 299.72 222.25)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "e3996b2f-bc01-4a3b-9b69-b16bb063983c")
	)
	(wire
		(pts
			(xy 167.64 275.59) (xy 167.64 276.86)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "e3cb21e6-ac0f-41ac-a3eb-02ad40f648af")
	)
	(wire
		(pts
			(xy 240.03 105.41) (xy 246.38 105.41)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "e4b6f820-6a5e-4da0-ba29-61b2acbd39cf")
	)
	(wire
		(pts
			(xy 236.22 57.15) (xy 236.22 54.61)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "e5b7bf43-728c-457d-a641-5b5da90c8bba")
	)
	(wire
		(pts
			(xy 68.58 218.44) (xy 68.58 219.71)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "e724901d-5be6-4e08-868b-ae488f1a79be")
	)
	(wire
		(pts
			(xy 133.35 115.57) (xy 133.35 116.84)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "e803b9bb-d247-458d-8da9-835291b68a68")
	)
	(wire
		(pts
			(xy 300.99 64.77) (xy 295.91 64.77)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "e881f9de-51a8-408e-b453-c47f3690b504")
	)
	(wire
		(pts
			(xy 184.15 218.44) (xy 184.15 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ea6b1129-a921-4ea1-b786-b3366a31466f")
	)
	(wire
		(pts
			(xy 274.32 177.8) (xy 271.78 177.8)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "eb08fb9b-a46e-4f45-b63a-b4ce6f3300a7")
	)
	(wire
		(pts
			(xy 179.07 40.64) (xy 179.07 43.18)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "eb1f2d4a-2b38-4fd1-a6bc-9a85bc0586e5")
	)
	(wire
		(pts
			(xy 300.99 59.69) (xy 303.53 59.69)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ebde5a09-ffd3-4c10-bb86-4d9df9466058")
	)
	(polyline
		(pts
			(xy 227.33 241.3) (xy 227.33 284.48)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "eca30938-7cf4-454a-8f09-0808f508282d")
	)
	(wire
		(pts
			(xy 240.03 113.03) (xy 246.38 113.03)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ece1933e-4d89-4d5b-85da-cbc0a393f780")
	)
	(wire
		(pts
			(xy 36.83 226.06) (xy 58.42 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ece95ed1-d565-40f2-a5eb-9a5580a68172")
	)
	(wire
		(pts
			(xy 128.27 248.92) (xy 128.27 257.81)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "eee9c303-3c56-41a4-962a-555cf85d2dbc")
	)
	(wire
		(pts
			(xy 247.65 27.94) (xy 247.65 30.48)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "efc540ff-44f4-4733-b155-d11e3aa6ef59")
	)
	(wire
		(pts
			(xy 260.35 265.43) (xy 260.35 269.24)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f098c8ea-a4e5-4dcd-be49-0ed7b39b9be2")
	)
	(wire
		(pts
			(xy 87.63 43.18) (xy 90.17 43.18)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f1c5e27d-374a-4e50-9ba0-c39d7ea0f6d2")
	)
	(wire
		(pts
			(xy 298.45 104.14) (xy 321.31 104.14)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f230678e-9d9b-4f14-a249-19242e387307")
	)
	(wire
		(pts
			(xy 36.83 121.92) (xy 29.21 121.92)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f2b56fe9-ffbf-4a04-9689-40077d0f72e8")
	)
	(wire
		(pts
			(xy 261.62 189.23) (xy 261.62 187.96)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f2ba6c1a-6555-493a-b520-ae29cfd3110a")
	)
	(wire
		(pts
			(xy 236.22 64.77) (xy 236.22 67.31)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f2dfa1a5-db32-4a8a-aa9d-e0ba32a83e7c")
	)
	(wire
		(pts
			(xy 381 226.06) (xy 383.54 226.06)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f3231146-50cc-44ac-b3ca-1d34ff6614c0")
	)
	(wire
		(pts
			(xy 290.83 72.39) (xy 290.83 74.93)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f425a8a3-6371-4a72-a2f5-3c54c29ad84e")
	)
	(wire
		(pts
			(xy 184.15 227.33) (xy 184.15 223.52)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f484b3ed-9a49-481e-b51e-174f6408205c")
	)
	(wire
		(pts
			(xy 78.74 43.18) (xy 80.01 43.18)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f4a18327-9b23-4f7c-8098-6af28e406ea4")
	)
	(wire
		(pts
			(xy 323.85 172.72) (xy 328.93 172.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f4b035b1-33b0-4535-bb54-ccbe1e6e8655")
	)
	(wire
		(pts
			(xy 34.29 267.97) (xy 46.99 267.97)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f54a9daa-f370-4d41-973d-d4f5c8d27de6")
	)
	(wire
		(pts
			(xy 46.99 278.13) (xy 46.99 279.4)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f5e90c24-0594-49c3-970c-fae00d8d0ac1")
	)
	(wire
		(pts
			(xy 182.88 276.86) (xy 167.64 276.86)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f61456bc-41ba-4dd4-aa4c-9a8503a378b1")
	)
	(wire
		(pts
			(xy 140.97 119.38) (xy 124.46 119.38)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f694b06a-9a94-4c06-9ed8-c473e0f17909")
	)
	(wire
		(pts
			(xy 165.1 40.64) (xy 179.07 40.64)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f6b87569-3772-4551-a2c6-8e0a976a27e5")
	)
	(wire
		(pts
			(xy 139.7 248.92) (xy 128.27 248.92)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f6f09c82-fbb5-4ad3-a1ac-bdefd67e8bae")
	)
	(wire
		(pts
			(xy 91.44 33.02) (xy 91.44 30.48)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f6f39e33-715c-4794-8a51-4d9a0ea39288")
	)
	(wire
		(pts
			(xy 111.76 276.86) (xy 143.51 276.86)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "f910644b-1c01-4518-b215-d072715a32bc")
	)
	(polyline
		(pts
			(xy 12.7 185.42) (xy 191.77 185.42)
		)
		(stroke
			(width 0)
			(type dash)
		)
		(uuid "f928d541-54e1-4ecb-9e5a-7a55fc742ac1")
	)
	(wire
		(pts
			(xy 165.1 45.72) (xy 172.72 45.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "fb6a5c2b-d29b-42f4-9854-320bc62f1d1f")
	)
	(wire
		(pts
			(xy 290.83 62.23) (xy 290.83 64.77)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "fc5df1ae-c01c-4fb4-8628-c2efcdfeedbe")
	)
	(wire
		(pts
			(xy 125.73 199.39) (xy 125.73 203.2)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "fcf96c52-a388-419d-a1b7-8d9400c04a5e")
	)
	(wire
		(pts
			(xy 231.14 57.15) (xy 236.22 57.15)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "fd154274-1b3a-4738-9fcd-6ae8af6f7080")
	)
	(wire
		(pts
			(xy 341.63 39.37) (xy 341.63 45.72)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "fe9239d8-8d25-48a6-a0fe-029a4ee30f6c")
	)
	(wire
		(pts
			(xy 184.15 214.63) (xy 172.72 214.63)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ff110f04-7593-4757-bb1c-aa8c487e67eb")
	)
	(wire
		(pts
			(xy 163.83 127) (xy 163.83 128.27)
		)
		(stroke
			(width 0)
			(type default)
		)
		(uuid "ff879686-aba9-4fbc-a6ca-44e3d1a075f3")
	)
	(text "USART1_TX/I2C2_SCL"
		(exclude_from_sim no)
		(at 358.14 101.6 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "03bc4180-7dd7-4e77-9f40-dc06ccc49129")
	)
	(text "SWDIO-JTMS"
		(exclude_from_sim no)
		(at 336.55 111.76 0)
		(effects
			(font
				(size 0.9906 0.9906)
			)
			(justify left bottom)
		)
		(uuid "08277183-ee68-4bdb-bb03-c83de3a92ea1")
	)
	(text "USART1_RX/I2C2_SDA"
		(exclude_from_sim no)
		(at 358.14 104.14 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "1618387b-7661-47ea-ae49-ca083bbf9020")
	)
	(text "1k - 2k"
		(exclude_from_sim no)
		(at 50.8 238.76 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "2d6d9e8b-aec5-47ee-9f5e-4bad0f7edb29")
	)
	(text "<< for use with I2C Grove modules\n      optional pull-ups:"
		(exclude_from_sim no)
		(at 153.67 119.38 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "3377839f-c09f-4234-8c35-2e704e9a1d49")
	)
	(text "Transient Voltage \nSuppression\n(put close to can connector)"
		(exclude_from_sim no)
		(at 365.76 214.63 0)
		(effects
			(font
				(size 0.7874 0.7874)
			)
			(justify left bottom)
		)
		(uuid "3c48e53f-e873-4270-83f5-19debf28172d")
	)
	(text "Battery Protection Circuit"
		(exclude_from_sim no)
		(at 12.7 190.5 0)
		(effects
			(font
				(size 2.9972 2.9972)
			)
			(justify left bottom)
		)
		(uuid "3d5ffd87-3913-4116-aec4-b204742d692d")
	)
	(text "ADDR=GND —> I2C:0x44 \nADDR=VDD —> I2C:0x45"
		(exclude_from_sim no)
		(at 124.46 31.75 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "415fb1b8-7868-4c21-b4f9-d1c551c0ad29")
	)
	(text "3.3V\n"
		(exclude_from_sim no)
		(at 62.23 246.38 0)
		(effects
			(font
				(size 2.9972 2.9972)
			)
			(justify left bottom)
		)
		(uuid "418bbed7-2ecb-4a2d-a320-7cc96a0ab7c6")
	)
	(text "USART3_TX"
		(exclude_from_sim no)
		(at 302.26 104.14 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "42868dbf-3cb8-406c-bf77-6d0f81ef4982")
	)
	(text "USART3_RX"
		(exclude_from_sim no)
		(at 302.26 106.68 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "612df358-d87e-4408-b0ff-f982c0b8011f")
	)
	(text "SCL\nSDA"
		(exclude_from_sim no)
		(at 147.32 119.38 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "6817aff8-b96b-4999-ab38-498878fdf2b0")
	)
	(text "Resistance should be as small as possible to avoid \nlowering of the overcharge detection accuracy \ncaused by VDD pin current. USE 100 - 470R\nUse 470Ω for better ESD protection."
		(exclude_from_sim no)
		(at 26.67 203.2 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "7b416fb3-5184-4513-9a3d-2e95bc30f254")
	)
	(text "Battery Charging"
		(exclude_from_sim no)
		(at 106.68 190.5 0)
		(effects
			(font
				(size 2.9972 2.9972)
			)
			(justify left bottom)
		)
		(uuid "8e1faea4-0fc2-4528-ac4e-8b49a18e092f")
	)
	(text "The DSR pin can be used to:\n Enter the command mode\n Disconnect and/or toggle connectable status\n Enable/disable the rest of the UART interface\n Enter/wake up from the sleep mode"
		(exclude_from_sim no)
		(at -26.67 96.52 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "916ff8eb-f2cb-41d2-830d-32020fcc50b0")
	)
	(text "2kOhm —> max. \ncharging current of 500mA\n10kOhm —> \ncharging current of 100mA"
		(exclude_from_sim no)
		(at 109.22 237.49 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "98654ed1-6edc-4442-a5f8-9171807ca79e")
	)
	(text "5V\n"
		(exclude_from_sim no)
		(at 106.68 246.38 0)
		(effects
			(font
				(size 2.9972 2.9972)
			)
			(justify left bottom)
		)
		(uuid "986717a5-ac46-402d-b92d-f3f5b3751fe0")
	)
	(text "OIBUS Connectors, Mechanical"
		(exclude_from_sim no)
		(at 194.31 143.51 0)
		(effects
			(font
				(size 2.9972 2.9972)
			)
			(justify left bottom)
		)
		(uuid "a48fc6ab-71a2-4e6c-9de0-324cacd03d97")
	)
	(text "USB/BAT Select"
		(exclude_from_sim no)
		(at 13.97 246.38 0)
		(effects
			(font
				(size 2.9972 2.9972)
			)
			(justify left bottom)
		)
		(uuid "b874d099-2a2c-4e33-a671-26e646bfecd0")
	)
	(text "SWCLK-JTCK"
		(exclude_from_sim no)
		(at 336.55 114.3 0)
		(effects
			(font
				(size 0.9906 0.9906)
			)
			(justify left bottom)
		)
		(uuid "cc443b25-1524-4fc6-bd4f-60c895dc6d49")
	)
	(text "STM32"
		(exclude_from_sim no)
		(at 195.58 19.05 0)
		(effects
			(font
				(size 2.9972 2.9972)
			)
			(justify left bottom)
		)
		(uuid "d5e5c7a1-661b-448d-a1e4-dc0b9eaef0aa")
	)
	(text "optional voltage divider to convert 5V TTL to 3.3V input"
		(exclude_from_sim no)
		(at 128.27 152.4 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "e92a1cf2-0652-4df0-af4a-c58f24e57928")
	)
	(text "UART baud rate 115’200 bit/s"
		(exclude_from_sim no)
		(at 115.57 111.76 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "f344ea6e-1aee-4926-90ec-99a0220ddde4")
	)
	(label "SPI_SCK"
		(at 317.5 111.76 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "0465d6f3-bdd5-4946-b850-1e789192f50a")
	)
	(label "SCL"
		(at 308.61 93.98 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "0b3b1efc-3631-4582-afc5-493c435d97c7")
	)
	(label "SPI_SCK"
		(at 325.12 182.88 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "0e9dc13f-3309-477c-8e1c-eaaead3a2ad9")
	)
	(label "5V_EN"
		(at 358.14 116.84 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "11707a6b-0eec-4788-bb1b-aa50135b6ded")
	)
	(label "CAN_LED"
		(at 273.05 19.05 270)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "12dd333e-65fb-4b1f-b311-650369c2d7dc")
	)
	(label "BLUE"
		(at 133.35 86.36 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "172c45d3-7ff2-4db9-ae59-5466389c20b6")
	)
	(label "CAN_RX"
		(at 308.61 99.06 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "1984e18e-4dce-4851-b7e6-1344d330a743")
	)
	(label "on_off"
		(at 246.38 60.96 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "2287b990-cb19-4b06-8b16-a08bfab2bf33")
	)
	(label "SWDIO"
		(at 205.74 35.56 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "231783b0-a275-4733-829e-55310007ca3d")
	)
	(label "SCL"
		(at 353.06 177.8 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "3083ee43-4af9-46d9-94ee-d2486a258835")
	)
	(label "CAN_SHDN"
		(at 308.61 91.44 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "30b6d7c6-a244-468f-a63e-e86041629c9f")
	)
	(label "SPI_MOSI"
		(at 325.12 180.34 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "30c441ec-6db6-48ae-b474-01694e3b9996")
	)
	(label "CAN_SHDN"
		(at 246.38 105.41 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "30fea83e-2680-447f-ae64-1ebe2666a16a")
	)
	(label "~{RESET}"
		(at 31.75 91.44 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "3832ab31-da26-4055-a5fb-f21bd8262375")
	)
	(label "BOOT"
		(at 308.61 55.88 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "38f2d5c0-9d88-4ae8-8b2a-38eeb048a683")
	)
	(label "SWDCLK"
		(at 358.14 114.3 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "3a4c1c97-c487-4b19-8cf1-b393a6542247")
	)
	(label "~{RESET}"
		(at 205.74 27.94 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "3d351048-f4a8-49b1-99a0-41dc2cd31ea6")
	)
	(label "SPS_TX_EXT"
		(at 123.19 142.24 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "426c2576-9e93-406f-ac7b-b4c1e9e12786")
	)
	(label "BLUE"
		(at 374.65 93.98 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "44628319-8d7b-4e0e-b9c4-3dbf9b0a44b8")
	)
	(label "CAN_RX"
		(at 246.38 110.49 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "4ea38276-8da2-45de-b616-af6da271c91d")
	)
	(label "BAT_MEAS"
		(at 175.26 214.63 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "4f644869-f4ee-4d36-bec0-16c5562cbbc7")
	)
	(label "SHT_ALERT"
		(at 173.99 43.18 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "501e1a8f-3856-4a36-82b7-771703e08965")
	)
	(label "USB_DM"
		(at 238.76 179.07 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "53359d0e-9ce4-4643-be18-e5bb22c1ec56")
	)
	(label "CAN_SILENT"
		(at 246.38 102.87 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "55d34323-af31-4ae4-87d8-4f85719c0b26")
	)
	(label "VIN"
		(at 114.3 257.81 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "569a9045-cfe6-4bfc-b803-debd882ce3ad")
	)
	(label "SDA"
		(at 308.61 96.52 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "5711c6cb-8b55-4348-bf01-fedc5bad4666")
	)
	(label "SWDIO"
		(at 358.14 111.76 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "5e547629-7466-4859-9418-a6705d2451e0")
	)
	(label "CAN_TX"
		(at 308.61 101.6 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "5e6189c8-a16d-4da8-b305-1a09ebe66c8d")
	)
	(label "CAN_L"
		(at 212.09 105.41 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "60a12b72-4eb9-4293-885b-d5de2a39f570")
	)
	(label "5V_EN"
		(at 123.19 262.89 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "60dfc0f7-08df-447b-94fb-f9aacdb1605d")
	)
	(label "VIN"
		(at 353.06 219.71 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "61a99a15-eb14-4a1d-81dc-7ac04dc33e61")
	)
	(label "USB_DM"
		(at 358.14 106.68 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "70b31161-4772-4f5f-8e42-1dbe5deab4a5")
	)
	(label "~{RESET}"
		(at 213.36 80.01 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "7331bf2e-f693-4073-bb69-21c7fcbf69dd")
	)
	(label "~{RESET}"
		(at 29.21 38.1 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "75f09fd1-aa5d-408f-855d-dbf3d12ff9af")
	)
	(label "CAN_LED"
		(at 308.61 68.58 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "775c6403-1aa9-46cd-a9b6-a6c5eaa3ac8f")
	)
	(label "SPI_MOSI"
		(at 317.5 116.84 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "787682dd-df15-4354-a9df-109e7974f7a7")
	)
	(label "VIN"
		(at 66.04 256.54 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "7996b775-50fc-4491-b30f-86e634c9b6f8")
	)
	(label "~{SPI_ADS_CS}"
		(at 317.5 109.22 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "7aa71bc0-a057-4ea0-b81a-ffb10ad94453")
	)
	(label "SPS_TX_EXT"
		(at 177.8 138.43 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "7cba2563-c7c0-41c3-a912-76b9f1bb4dde")
	)
	(label "BAT_MEAS"
		(at 358.14 96.52 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "7ea87c6c-5b29-4c34-b18c-7425420821f2")
	)
	(label "USB_DP"
		(at 274.32 180.34 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "807828ef-a5eb-4b4a-ae0c-8d070f2f5235")
	)
	(label "SDA"
		(at 325.12 177.8 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "82ce2a49-828f-4de4-8710-b48b9af56a55")
	)
	(label "GPS_TIME"
		(at 99.06 38.1 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "840b49f9-8067-4b75-8905-c26fbf682547")
	)
	(label "on_off"
		(at 358.14 99.06 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "85a5911d-a6a7-4427-9b7e-e1189aeeaccf")
	)
	(label "CAN_L"
		(at 353.06 185.42 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "8ec4e684-187e-489c-b0b6-7a029c49c40f")
	)
	(label "~{SPI_ADS_CS}"
		(at 353.06 182.88 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "8ef8b42f-001c-46d9-ac54-1f5156fa28c3")
	)
	(label "ID"
		(at 238.76 181.61 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "9290ea8e-3cdc-47e2-a016-703c5685fb19")
	)
	(label "SPI_MISO"
		(at 317.5 114.3 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "9653b9e1-1818-4dee-bdc9-3e770110727a")
	)
	(label "RED"
		(at 308.61 78.74 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "96f4dae4-8fb5-4e9d-8f6d-28c96a9e9d98")
	)
	(label "SPI_MISO"
		(at 353.06 180.34 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "97441a97-8e75-4f0b-9c11-c9e0f11c4b6d")
	)
	(label "CAN_H"
		(at 212.09 110.49 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "9a5c4b5b-56e8-4d88-80e9-bc6fb7485c22")
	)
	(label "USB_DP"
		(at 238.76 176.53 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "9b8f7eeb-63b7-462c-b042-275b4a8aa4cf")
	)
	(label "SWDSWO"
		(at 205.74 40.64 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "9d514daf-2a85-4b8d-8b59-6a5cd75fc3a8")
	)
	(label "SPS_TX_EXT"
		(at 124.46 119.38 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "a036574b-4993-429d-87ae-fb5f71025270")
	)
	(label "CAN_TX"
		(at 246.38 113.03 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "a5058c7f-383e-4ec2-9fec-5484b26ff1d0")
	)
	(label "GREEN"
		(at 308.61 81.28 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "ada7d94f-004f-45fb-90c1-b9f07993e76e")
	)
	(label "GPS_TIME"
		(at 308.61 83.82 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "bcbac9ab-6559-485d-b300-f0aa4e6e1f24")
	)
	(label "VIN"
		(at 40.64 267.97 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "ca5fda71-de3e-419b-85b3-b97a2e9ff9de")
	)
	(label "CAN_H"
		(at 361.95 224.79 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "ca9245fc-1a4f-4a45-ad34-bcc7a2d23b31")
	)
	(label "CAN_H"
		(at 325.12 185.42 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "cf052775-cda2-482c-8bba-b9535214a800")
	)
	(label "GREEN"
		(at 133.35 91.44 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "d72729cb-bb21-4731-adf6-d3041159e93e")
	)
	(label "RED"
		(at 133.35 96.52 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "d91e0dc5-73e0-4737-ae0f-2d660d87c2a5")
	)
	(label "SWDSWO"
		(at 308.61 86.36 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "da65967c-d220-44e7-a8f4-d59a0720dc3b")
	)
	(label "BOOT"
		(at 213.36 60.96 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "de5903b9-18f2-430d-b5c1-c613e4dfe3d0")
	)
	(label "USB_DM"
		(at 274.32 177.8 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "e31072a9-acfc-4deb-a9b3-86f9537259b8")
	)
	(label "CAN_SILENT"
		(at 308.61 88.9 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "e35a0873-1cb6-4b19-9dd3-72f677f9c24d")
	)
	(label "CAN_L"
		(at 361.95 227.33 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "ec3b62a2-b3cb-455e-966d-677444e2a033")
	)
	(label "SWDCLK"
		(at 205.74 38.1 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right bottom)
		)
		(uuid "f6b23501-33e1-4b86-8f17-2da2c9e80035")
	)
	(label "USB_DP"
		(at 358.14 109.22 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "f9ad5b4a-220f-46f0-be96-051c3c25c539")
	)
	(label "~{RESET}"
		(at 308.61 50.8 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "fd606218-b3d5-44ea-abfb-a445412e5276")
	)
	(label "SDA"
		(at 128.27 48.26 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "ffaca7da-c8c8-4c42-90f8-8c6cc52be796")
	)
	(label "SCL"
		(at 128.27 50.8 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left bottom)
		)
		(uuid "ffd7960d-35c1-4df0-8a82-2d457efd5d66")
	)
	(global_label "SPS_RX"
		(shape input)
		(at 382.27 101.6 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "05a636e9-4117-4711-b405-6b8dbe4b9580")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 382.27 101.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_RX"
		(shape input)
		(at 29.21 106.68 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "1ecf2b81-0db7-46f1-aed9-04fdc0b3fefb")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 29.21 106.68 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_RTS"
		(shape input)
		(at 29.21 104.14 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "36698930-c5ca-4248-9c4b-49d867f0ed73")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 29.21 104.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "SPS_TX"
		(shape input)
		(at 119.38 152.4 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "5480c441-c339-44d3-a1eb-41f57679c611")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 119.38 152.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_DTR"
		(shape input)
		(at 358.14 88.9 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "6273a758-9d45-49f8-a518-63d27d9593d9")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 358.14 88.9 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "GPS_TX"
		(shape input)
		(at 90.17 45.72 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "638d1c88-5964-4ca2-8f97-53b151735a1a")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 90.17 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_CTS"
		(shape input)
		(at 358.14 81.28 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "70982faf-69d3-411c-90c9-aa4917a64d80")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 358.14 81.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_DSR"
		(shape input)
		(at 358.14 91.44 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "7b418ae8-9b3b-43bb-9fd1-d9a8ab17cf9b")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 358.14 91.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_CTS"
		(shape input)
		(at 29.21 101.6 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "9ad64d8f-3fd0-4b88-a496-f68c96d28302")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 29.21 101.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "SPS_RX"
		(shape input)
		(at 133.35 115.57 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "a1959d36-46f9-4541-bce9-99c8b6086e2f")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 133.35 115.57 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "GPS_RX"
		(shape input)
		(at 90.17 43.18 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "ad679bc3-cb41-4245-bb4a-16b1a6a7c337")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 90.17 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "SPS_RX"
		(shape input)
		(at 162.56 138.43 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "ae8f2343-5914-4bd5-a181-68904a7608f9")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 162.56 138.43 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_TX"
		(shape input)
		(at 29.21 109.22 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "b6af9b50-f40a-49aa-ab11-a1547c66d8e5")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 29.21 109.22 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_DSR"
		(shape input)
		(at 29.21 96.52 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "ba886a88-032c-422b-8b3e-e34a334aacd6")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 29.21 96.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "GPS_TX"
		(shape input)
		(at 298.45 106.68 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "bfa9503e-d30d-41d5-ab2a-f2405a0bbd91")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 298.45 106.68 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "GPS_RX"
		(shape input)
		(at 298.45 104.14 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "c3797260-9454-43c2-a344-188266b93539")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 298.45 104.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_TX"
		(shape input)
		(at 358.14 86.36 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "c4b62c10-49d0-461c-b1db-e67a6f96a73d")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 358.14 86.36 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_RX"
		(shape input)
		(at 358.14 83.82 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "cd18d5cb-7dc1-4f2f-b602-dd96b1ad7af9")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 358.14 83.82 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_RTS"
		(shape input)
		(at 358.14 78.74 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "d27a30c6-e95b-4b70-beac-6558e5e2218c")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 358.14 78.74 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "NINA_DTR"
		(shape input)
		(at 29.21 99.06 180)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify right)
		)
		(uuid "e782bcc6-d257-4ab7-93d5-df331cf6d141")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 29.21 99.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(global_label "SPS_TX"
		(shape input)
		(at 382.27 104.14 0)
		(effects
			(font
				(size 1.27 1.27)
			)
			(justify left)
		)
		(uuid "fe32c2b2-3b37-415e-b352-63d9e3a99af5")
		(property "Intersheetrefs" "${INTERSHEET_REFS}"
			(at 382.27 104.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
	)
	(symbol
		(lib_id "Mechanical:Fiducial")
		(at 280.67 261.62 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c1e4bdc")
		(property "Reference" "FID1"
			(at 282.829 260.4516 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "Fiducial"
			(at 282.829 262.763 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Fiducial:Fiducial_0.5mm_Mask1mm"
			(at 280.67 261.62 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 280.67 261.62 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 280.67 261.62 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "FID1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 260.35 269.24 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c1effe1")
		(property "Reference" "#PWR031"
			(at 260.35 275.59 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 260.477 273.6342 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 260.35 269.24 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 260.35 269.24 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 260.35 269.24 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "85f839ec-4f05-451a-9098-2e8cb86cdf2b")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR031")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:STM32F303CCTx-MCU_ST_STM32F3")
		(at 339.09 83.82 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c5de465")
		(property "Reference" "U8"
			(at 354.33 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "STM32F303CCTx"
			(at 339.09 72.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Package_QFP:LQFP-48_7x7mm_P0.5mm"
			(at 323.85 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
				(hide yes)
			)
		)
		(property "Datasheet" "http://www.st.com/st-web-ui/static/active/en/resource/technical/document/datasheet/DM00058181.pdf"
			(at 339.09 83.82 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 339.09 83.82 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "STM32F303CCT6\r"
			(at 0 167.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C81523"
			(at 339.09 83.82 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "bd0668d7-89b8-406c-a936-00184b1d49eb")
		)
		(pin "10"
			(uuid "66a60740-cb73-4e6d-95a2-bf9996527168")
		)
		(pin "11"
			(uuid "901160b7-8efd-4dc4-a669-ba4e2af423d6")
		)
		(pin "12"
			(uuid "72f29877-2cfd-43d2-80e9-2d83101cc867")
		)
		(pin "13"
			(uuid "ed34e632-5d35-4eb3-8803-407c2b43e921")
		)
		(pin "18"
			(uuid "8e9344c1-9f55-42c4-847c-5c2752d9f185")
		)
		(pin "19"
			(uuid "793a6546-155c-4e15-9d70-ac28334696bc")
		)
		(pin "2"
			(uuid "d737b2d3-631e-49f8-8ac4-12b7d8683d71")
		)
		(pin "20"
			(uuid "889d7c74-68dd-4c81-81cf-f672ebe20299")
		)
		(pin "21"
			(uuid "237f2480-ac0a-489c-a618-709cf77e3b29")
		)
		(pin "22"
			(uuid "e5569eba-7277-4911-af09-bd786ce19880")
		)
		(pin "23"
			(uuid "9e62531d-1959-4b53-b986-b5d5033cbfdb")
		)
		(pin "24"
			(uuid "9611d7a2-a9f9-4cf6-a601-9cee8dea45e9")
		)
		(pin "25"
			(uuid "7220fa89-3cee-48dc-b556-5eda14739429")
		)
		(pin "14"
			(uuid "7181fc81-175b-4fb0-b256-dae8f2f7724e")
		)
		(pin "15"
			(uuid "56f8d10f-6ffe-48d9-822b-1d9046585ddd")
		)
		(pin "16"
			(uuid "66404847-145e-4561-9cdd-47a44dbcbd84")
		)
		(pin "17"
			(uuid "c700d815-61ae-40f3-b209-df663d74f941")
		)
		(pin "6"
			(uuid "a0971580-02f0-482a-b713-0d3d84466f8e")
		)
		(pin "7"
			(uuid "3ff7c50d-e9ff-4dfa-bd59-65bbe90c329d")
		)
		(pin "8"
			(uuid "8426bf7f-81ee-454a-823f-7e73b1862292")
		)
		(pin "9"
			(uuid "4aac6718-abfe-4e53-a834-3e94103b9800")
		)
		(pin "26"
			(uuid "179d7c00-92a7-49ce-857b-21e290eba373")
		)
		(pin "27"
			(uuid "57003375-054c-4535-87d5-0b664356fd21")
		)
		(pin "28"
			(uuid "c30a2663-987c-4f29-98bc-a01351fb84c8")
		)
		(pin "29"
			(uuid "8981a695-f57f-4a03-b2ba-34eae86c28f6")
		)
		(pin "3"
			(uuid "b4cada95-d642-4b02-b373-ee05a75006c7")
		)
		(pin "30"
			(uuid "4922a3af-3350-4152-a725-9304104f8a11")
		)
		(pin "31"
			(uuid "a6303076-d243-495d-b7f9-bd8e528f408a")
		)
		(pin "32"
			(uuid "6b880e30-1f2c-4066-adc6-3000be672aef")
		)
		(pin "33"
			(uuid "78aa2ea7-e37b-478d-985e-0445513d7b12")
		)
		(pin "34"
			(uuid "3561780b-11dc-4467-b841-df30d1faafda")
		)
		(pin "35"
			(uuid "48a221dd-12b8-44fd-9dd1-816b1ab5bf3e")
		)
		(pin "36"
			(uuid "6ee87d85-e1e8-4e68-bd0b-05a20be8cfe0")
		)
		(pin "37"
			(uuid "283995fe-972b-46b5-a1d8-f531cfaeef40")
		)
		(pin "38"
			(uuid "c5a6772f-6e16-4321-ba52-68222e00ec2b")
		)
		(pin "39"
			(uuid "08ea3faf-e9cb-496b-9a56-f3940970408a")
		)
		(pin "4"
			(uuid "6892f568-3d6d-422b-ada8-4f47853d8473")
		)
		(pin "40"
			(uuid "a06110c0-2973-4c45-9844-b2022ecf49ca")
		)
		(pin "41"
			(uuid "78c17adb-8081-4544-97ab-78afc51cf5f1")
		)
		(pin "42"
			(uuid "eaea91d5-a0bd-4a36-aa7f-c0ad0e558bea")
		)
		(pin "43"
			(uuid "5babac5c-0297-4f21-a0fd-b06715701dfd")
		)
		(pin "44"
			(uuid "e4259e8c-3c95-4eef-80ff-9705bab6efcc")
		)
		(pin "45"
			(uuid "fd37173f-d522-4a50-afa0-b43168a6887c")
		)
		(pin "46"
			(uuid "ed806563-428b-4fc4-893d-6bb15f0000fd")
		)
		(pin "47"
			(uuid "55d24b48-ed91-45e7-9937-95bf7fc188d6")
		)
		(pin "48"
			(uuid "92685fbb-7c22-4324-8ccf-492fe0fbb7c6")
		)
		(pin "5"
			(uuid "f280acfe-ae76-483b-9e03-5e809fc0ffb4")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U8")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 345.44 39.37 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c618354")
		(property "Reference" "C21"
			(at 342.9 40.64 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 345.44 43.18 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 345.44 39.37 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 345.44 39.37 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 345.44 39.37 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 306.07 -306.07 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 345.44 39.37 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "72a15fb2-3fb5-412c-a551-22921d9a4b7f")
		)
		(pin "2"
			(uuid "fe93ebc5-8fe1-49ca-9943-a0d24b67a864")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C21")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 345.44 34.29 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c618492")
		(property "Reference" "C20"
			(at 341.63 35.56 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 345.44 36.83 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 345.44 34.29 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 345.44 34.29 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 345.44 34.29 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 311.15 -311.15 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 345.44 34.29 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "897eda6a-e7e1-495b-aa8f-9350ac77cd59")
		)
		(pin "2"
			(uuid "229f33b8-df5e-46fe-95e9-1556d645e59f")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C20")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 345.44 29.21 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c618552")
		(property "Reference" "C19"
			(at 342.9 30.48 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 345.44 26.67 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 345.44 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 345.44 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 345.44 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 316.23 -316.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 345.44 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "b992d5ad-5a2a-458a-9329-bc80bfe0800f")
		)
		(pin "2"
			(uuid "6d3db741-6443-45c2-9578-ce9f3aa9fdcd")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C19")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 336.55 29.21 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c6a7c90")
		(property "Reference" "#PWR045"
			(at 336.55 33.02 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 334.01 25.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 336.55 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 336.55 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 336.55 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "898d9c2f-af0f-42aa-95fd-f65b8131a551")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR045")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 354.33 36.83 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c7f8865")
		(property "Reference" "#PWR049"
			(at 354.33 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 354.457 41.2242 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 354.33 36.83 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 354.33 36.83 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 354.33 36.83 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "f7b0a856-811d-4332-ad78-0e7b532b9148")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR049")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 336.55 125.73 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c85940b")
		(property "Reference" "#PWR046"
			(at 336.55 132.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 336.677 130.1242 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 336.55 125.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 336.55 125.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 336.55 125.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "d4d97e99-aa7a-4c4c-a308-d1bbbff7eabf")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR046")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 224.79 120.65 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c920a72")
		(property "Reference" "#PWR035"
			(at 228.6 120.65 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 220.98 123.19 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 224.79 120.65 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 224.79 120.65 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 224.79 120.65 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "86796e0e-f477-4db1-b374-6dc8eb30bbad")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR035")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 234.95 93.98 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c942e34")
		(property "Reference" "#PWR036"
			(at 234.95 100.33 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 235.077 98.3742 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 234.95 93.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 234.95 93.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 234.95 93.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "e6281e6a-8283-4cca-bc82-def0005e3ee1")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR036")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 233.68 120.65 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c965c55")
		(property "Reference" "C15"
			(at 231.14 121.92 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 233.68 118.11 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 233.68 120.65 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 233.68 120.65 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 233.68 120.65 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 124.46 -171.45 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 233.68 120.65 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "8a22cd57-c0e8-4b32-a0de-ebe2f9265cc7")
		)
		(pin "2"
			(uuid "ecf1506f-f614-42a2-bbba-c05e171e67d1")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C15")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 237.49 121.92 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c988315")
		(property "Reference" "#PWR037"
			(at 237.49 128.27 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 237.617 126.3142 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 237.49 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 237.49 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 237.49 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "0ebfc2c8-4881-4184-b466-11b055fcb8a8")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR037")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Interface_CAN_LIN:TCAN330")
		(at 227.33 107.95 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005c9abb57")
		(property "Reference" "U7"
			(at 218.44 99.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "DNP"
			(at 227.33 109.22 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-23-8"
			(at 227.33 95.25 0)
			(effects
				(font
					(size 1.27 1.27)
					(italic yes)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "http://www.ti.com/lit/ds/symlink/tcan337.pdf"
			(at 227.33 107.95 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 227.33 107.95 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "TCAN330DCNT\r"
			(at 513.08 11.43 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "041d8eed-3ee8-42e7-9d3a-96f193e5cacd")
		)
		(pin "2"
			(uuid "3707b18d-502d-4dd7-bf39-896c08198862")
		)
		(pin "3"
			(uuid "ac6aa6c1-f540-488f-bbe1-564a8c8ceb44")
		)
		(pin "4"
			(uuid "77c71f66-9607-474f-a851-45b09500de86")
		)
		(pin "5"
			(uuid "49e3076b-a54f-4fce-89a1-e6222d49bb37")
		)
		(pin "6"
			(uuid "0e672f30-7e91-45e5-aa05-eb634d235450")
		)
		(pin "7"
			(uuid "da2ba0af-516f-42ac-9623-df69171fc8b2")
		)
		(pin "8"
			(uuid "6b53df8b-b2b4-4c52-9ef6-938a1c193e7e")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U7")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:TC2030-MCP-Tag-Connect")
		(at 217.17 27.94 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cadfa22")
		(property "Reference" "P1"
			(at 227.33 21.6662 0)
			(effects
				(font
					(size 1.524 1.524)
				)
			)
		)
		(property "Value" "TC2030-MCP"
			(at 227.33 24.3586 0)
			(effects
				(font
					(size 1.524 1.524)
				)
			)
		)
		(property "Footprint" "lib_fp_global:TC2030-MCP-NL"
			(at 217.17 27.94 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 217.17 27.94 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 217.17 27.94 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "4fe8871e-acb5-4bc9-835a-f8aff57ed939")
		)
		(pin "2"
			(uuid "b4646850-9aee-4097-8c70-f65b309d9adb")
		)
		(pin "3"
			(uuid "df59a475-afde-400c-a08c-a8453da7122e")
		)
		(pin "4"
			(uuid "c4ba2d3f-9c40-4d80-94f5-215d1636be2a")
		)
		(pin "5"
			(uuid "95993981-1608-4cb6-93a5-baf17f5cac26")
		)
		(pin "6"
			(uuid "c1717709-b30b-44e8-bb59-ccda339836dd")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "P1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 247.65 27.94 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cae3d48")
		(property "Reference" "#PWR029"
			(at 247.65 31.75 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 245.11 24.13 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 247.65 27.94 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 247.65 27.94 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 247.65 27.94 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "84ce066b-324f-4576-98c2-221df4bc5d8f")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR029")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 247.65 34.29 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005caf3775")
		(property "Reference" "#PWR030"
			(at 247.65 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 251.46 35.56 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 247.65 34.29 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 247.65 34.29 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 247.65 34.29 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "8baf8c40-e0a6-4315-9e8b-b892549b7202")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR030")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 290.83 90.17 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cb285bf")
		(property "Reference" "R10"
			(at 292.608 89.0016 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "4.7k"
			(at 292.608 91.313 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 289.052 90.17 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 290.83 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 290.83 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJP03F4701V"
			(at -96.52 185.42 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C427306"
			(at 290.83 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "90a5fa48-4d60-4b3f-8bc5-32bedd9c4f9f")
		)
		(pin "2"
			(uuid "af727fb3-ab7b-4847-934b-98b8f8ba00c4")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R10")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 299.72 90.17 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cb29209")
		(property "Reference" "R11"
			(at 301.498 89.0016 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "4.7k"
			(at 301.498 91.313 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 297.942 90.17 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 299.72 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 299.72 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJP03F4701V"
			(at -96.52 185.42 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C427306"
			(at 299.72 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "0e088e54-3b57-4e4f-b372-5d2a9e5d79ee")
		)
		(pin "2"
			(uuid "ab4a3ba1-3f9d-4286-833d-8b250be0abd0")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R11")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 290.83 85.09 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cb295c6")
		(property "Reference" "#PWR052"
			(at 290.83 88.9 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 294.64 81.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 290.83 85.09 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 290.83 85.09 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 290.83 85.09 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "80337fb8-c171-40c6-88bd-375124d6be01")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR052")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 299.72 85.09 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cb3991c")
		(property "Reference" "#PWR053"
			(at 299.72 88.9 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 303.53 81.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 299.72 85.09 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 299.72 85.09 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 299.72 85.09 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "13d92089-11f1-481c-8a66-ad4f6202e547")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR053")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:OI_Logo-OIBUS_20")
		(at 240.03 262.89 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cba2f7c")
		(property "Reference" "B1"
			(at 244.5512 261.7216 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "OI_Logo"
			(at 244.5512 264.033 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "lib_fp_global:octanis_instruments_logo"
			(at 240.03 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 240.03 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 240.03 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "B1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Mechanical:Fiducial")
		(at 280.67 274.32 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cbba411")
		(property "Reference" "FID3"
			(at 282.829 273.1516 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "Fiducial"
			(at 282.829 275.463 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Fiducial:Fiducial_0.5mm_Mask1mm"
			(at 280.67 274.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 280.67 274.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 280.67 274.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "FID3")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 381 228.6 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cbdc491")
		(property "Reference" "#PWR047"
			(at 381 234.95 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 381.127 232.9942 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 381 228.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 381 228.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 381 228.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "47420e30-2bf9-4701-8512-62bd6d8dcfcb")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR047")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:OIBUS_12.1_CONN-OIBUS_20")
		(at 339.09 165.1 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cc166c1")
		(property "Reference" "H2"
			(at 339.09 166.8018 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "DNP"
			(at 339.09 168.7322 0)
			(effects
				(font
					(size 0.762 0.762)
				)
			)
		)
		(property "Footprint" "lib_fp_global:OIBUS12_connector"
			(at 339.09 165.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 339.09 165.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 339.09 165.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN2" "PHF254TH2x6"
			(at 5.08 318.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "A2541HWV-2x6P"
			(at 339.09 165.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C239346"
			(at 339.09 165.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "ee9f29c7-d642-4d6c-a63a-76d9201b711a")
		)
		(pin "10"
			(uuid "6a86e6e8-fbdd-4a2a-b18a-d8d092cb7cd8")
		)
		(pin "11"
			(uuid "93eadbd6-c65d-4a62-8302-1228746f7050")
		)
		(pin "12"
			(uuid "ec36966e-42ef-41d5-95a6-bc640a764025")
		)
		(pin "2"
			(uuid "8a65cb1d-efb4-4837-b044-af4cb47deecf")
		)
		(pin "3"
			(uuid "68656632-1bb8-4a31-8b17-3a6d3d4695f3")
		)
		(pin "4"
			(uuid "99a2ce7a-b7a0-43a6-b9f3-34c03e254bea")
		)
		(pin "5"
			(uuid "2b50df3c-f909-43e0-8cf0-04a48880a45c")
		)
		(pin "6"
			(uuid "1d4f6bb7-fdb1-4f44-ae01-6e9b972fca1f")
		)
		(pin "7"
			(uuid "42d29a57-e589-4ce2-9e64-4de561415350")
		)
		(pin "8"
			(uuid "1ef747f9-5fee-41ce-bfcb-138c22db2829")
		)
		(pin "9"
			(uuid "32af05c5-1df9-4cd2-9304-13c27af46243")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "H2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 273.05 45.72 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cc3037f")
		(property "Reference" "#PWR032"
			(at 273.05 52.07 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 273.177 50.1142 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 273.05 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 273.05 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 273.05 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "c0580499-649d-43c9-8b89-73ee97bd5810")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR032")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+5V-power")
		(at 323.85 170.18 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cc53c7e")
		(property "Reference" "#PWR042"
			(at 323.85 173.99 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+5V"
			(at 324.231 165.7858 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 323.85 170.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 323.85 170.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 323.85 170.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "dc50dd83-de56-4301-8182-db5a95f8770e")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR042")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 318.77 170.18 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cc65255")
		(property "Reference" "#PWR041"
			(at 318.77 173.99 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 319.151 165.7858 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 318.77 170.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 318.77 170.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 318.77 170.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "eb1aa67a-c61d-4213-85a3-4abb18f93a8f")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR041")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C")
		(at 299.72 226.06 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cccb764")
		(property "Reference" "C14"
			(at 302.641 224.8916 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "10u"
			(at 302.641 227.203 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0805_2012Metric"
			(at 298.7548 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 299.72 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 299.72 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL21A106MPFNNNE"
			(at 613.41 15.24 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C91245"
			(at 299.72 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "51d0093e-4c60-4fc6-a107-241ffcf190be")
		)
		(pin "2"
			(uuid "667a141d-e953-4320-8154-f5e2b6989413")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C14")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 299.72 231.14 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cccb76c")
		(property "Reference" "#PWR034"
			(at 299.72 237.49 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 299.847 234.3912 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" ""
			(at 299.72 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 299.72 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 299.72 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "aeedc4ad-806b-4081-b4b1-ee9d9764a29b")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR034")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+5V-power")
		(at 299.72 220.98 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cccb773")
		(property "Reference" "#PWR033"
			(at 299.72 224.79 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+5V"
			(at 300.101 216.5858 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 299.72 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 299.72 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 299.72 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "157f4dcb-1fef-4605-9bd0-e11017b07889")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR033")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:D_TVS_x2_AAC-Device")
		(at 374.65 226.06 90)
		(mirror x)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005ccd6026")
		(property "Reference" "D6"
			(at 379.73 223.52 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "DNP"
			(at 388.62 233.68 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
				(hide yes)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-323_SC-70"
			(at 374.65 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 374.65 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 374.65 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "PESD2IVN27-UX\r"
			(at 607.06 -115.57 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "985c0eea-d783-467d-8362-31d1d7d1b550")
		)
		(pin "2"
			(uuid "382fef31-b716-429f-bddb-d9880b4d21c2")
		)
		(pin "3"
			(uuid "7b605961-e7fc-4dca-8f05-77b75662512e")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "D6")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 354.33 172.72 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cd38b2f")
		(property "Reference" "#PWR048"
			(at 360.68 172.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 358.7242 172.593 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 354.33 172.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 354.33 172.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 354.33 172.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "d858cb55-2a91-4816-9d5b-5abda2093c26")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR048")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Mechanical:Fiducial")
		(at 280.67 267.97 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cd62bf1")
		(property "Reference" "FID2"
			(at 282.829 266.8016 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "Fiducial"
			(at 282.829 269.113 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Fiducial:Fiducial_0.5mm_Mask1mm"
			(at 280.67 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 280.67 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 280.67 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "FID2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+5V-power")
		(at 356.87 222.25 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005cdcfb37")
		(property "Reference" "#PWR044"
			(at 356.87 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+5V"
			(at 357.251 217.8558 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 356.87 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 356.87 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 356.87 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "369b89ea-53c2-4681-84d8-b33ef6ec035b")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR044")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:LED")
		(at 208.28 259.08 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d022180")
		(property "Reference" "D4"
			(at 211.2772 258.1148 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "LED_green"
			(at 211.2772 260.4262 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "LED_SMD:LED_0603_1608Metric"
			(at 208.28 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 208.28 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 208.28 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "LTST-S270KGKT"
			(at 431.8 482.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C125113"
			(at 208.28 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "fa7c0bfc-d015-42fc-aff6-0391f8a5283f")
		)
		(pin "2"
			(uuid "c36c4d80-97ae-4ad2-8351-033e8debfbd3")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "D4")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 208.28 271.78 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d022187")
		(property "Reference" "#PWR026"
			(at 208.28 278.13 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 208.407 276.1742 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 208.28 271.78 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 208.28 271.78 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 208.28 271.78 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "6fa54745-715c-447a-8525-b5306fd07496")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR026")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 208.28 267.97 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d02218d")
		(property "Reference" "R8"
			(at 210.058 266.8016 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "2.7k"
			(at 210.058 269.113 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 206.502 267.97 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 208.28 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 208.28 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C144097"
			(at 208.28 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "AF0603FR-072K7L"
			(at 208.28 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "83ea1f22-e9fa-4d74-9b32-1febeba4383e")
		)
		(pin "2"
			(uuid "1fbdcb1a-0ba4-429e-97f3-70b8826b41f8")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R8")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:PWR_FLAG-power")
		(at 372.11 44.45 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d0560dd")
		(property "Reference" "#FLG01"
			(at 372.11 42.545 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "PWR_FLAG"
			(at 378.46 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 372.11 44.45 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 372.11 44.45 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 372.11 44.45 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "81f272b9-f14a-418c-808a-d2e662f46443")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#FLG01")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:Crystal_GND24_Small-Device")
		(at 300.99 62.23 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d059936")
		(property "Reference" "Y1"
			(at 298.45 58.42 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "16M"
			(at 303.53 59.69 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Crystal:Crystal_SMD_SeikoEpson_FA238-4Pin_3.2x2.5mm"
			(at 300.99 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 300.99 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 300.99 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "XXBBBCNANF-16M"
			(at 234.95 -240.03 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C117874"
			(at 300.99 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "f60b534a-f839-4418-a557-33ea73522a71")
		)
		(pin "2"
			(uuid "a0496b5c-b184-456f-9d7d-d6f00f872412")
		)
		(pin "3"
			(uuid "0e7d38d8-369b-419f-bb7a-035a36515ea8")
		)
		(pin "4"
			(uuid "f9201524-8c3d-4046-8102-15b28901a81e")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "Y1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 273.05 31.75 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d078eae")
		(property "Reference" "R9"
			(at 274.828 30.5816 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "430R"
			(at 274.828 32.893 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 271.272 31.75 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 273.05 31.75 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 273.05 31.75 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C228199"
			(at 273.05 31.75 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "AC0603JR-07430RL"
			(at 273.05 31.75 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "0eba0ed4-e567-468a-b5e0-37c9e12a8f55")
		)
		(pin "2"
			(uuid "a7e9a041-1739-499d-b50e-7b1e83d332d6")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R9")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:LED")
		(at 273.05 40.64 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d0795d3")
		(property "Reference" "D5"
			(at 276.0472 39.6748 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "LED_blue_side"
			(at 276.0472 41.9862 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "LED_SMD:LED_0603_1608Metric"
			(at 273.05 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 273.05 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 273.05 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "LTST-S270TBKT"
			(at 372.11 416.56 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C125115"
			(at 273.05 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "bb82a858-8f2a-4814-8c53-cb57cdcdf901")
		)
		(pin "2"
			(uuid "9b3ff0e4-f632-4c04-974a-3f067e146786")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "D5")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 226.06 80.01 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d195b26")
		(property "Reference" "C18"
			(at 229.87 78.74 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 222.25 78.74 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 226.06 80.01 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 226.06 80.01 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 226.06 80.01 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 279.4 391.16 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 226.06 80.01 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "f7cdebdf-2531-45af-91ed-f461985a5834")
		)
		(pin "2"
			(uuid "1c075033-33d9-439e-ace6-2e990c6ec743")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C18")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 288.29 62.23 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d19d403")
		(property "Reference" "#PWR038"
			(at 281.94 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 283.21 62.23 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 288.29 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 288.29 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 288.29 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "94f2d24d-03ff-4f9f-8fd0-cf425223392a")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR038")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:VBUS-power")
		(at 20.32 252.73 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d297af2")
		(property "Reference" "#PWR01"
			(at 20.32 256.54 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "VBUS"
			(at 20.32 248.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 20.32 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 20.32 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 20.32 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "d8a4c5f9-dcda-4a93-bdd8-2fe70fb736bc")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR01")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 293.37 64.77 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d2cd5b6")
		(property "Reference" "C17"
			(at 289.56 66.04 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "12p"
			(at 297.18 66.04 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 293.37 64.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 293.37 64.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 293.37 64.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C38523"
			(at 293.37 64.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10C120JB8NNNC"
			(at 293.37 64.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "7b88ec06-9010-4025-b71a-7c646342f3ad")
		)
		(pin "2"
			(uuid "96d1281a-8714-4adc-a331-3689f868b1a4")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C17")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 293.37 59.69 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d2cdcda")
		(property "Reference" "C16"
			(at 295.91 57.15 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "12p"
			(at 290.83 57.15 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 293.37 59.69 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 293.37 59.69 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 293.37 59.69 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C38523"
			(at 293.37 59.69 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10C120JB8NNNC"
			(at 293.37 59.69 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "2a75d571-d8c6-4ea4-8d20-3b6fdc485592")
		)
		(pin "2"
			(uuid "97b8c4eb-a75c-4bed-95a0-d21b44aa3076")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C16")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Mechanical:MountingHole_Pad")
		(at 260.35 262.89 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d2f1be4")
		(property "Reference" "H1"
			(at 262.89 261.5946 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "MountingHole_Pad"
			(at 262.89 263.906 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "MountingHole:MountingHole_3.2mm_M3_DIN965_Pad"
			(at 260.35 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 260.35 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 260.35 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "4fc3ac40-3464-43a3-806a-4fc7be707cc4")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "H1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:CP-Device")
		(at 46.99 274.32 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d342431")
		(property "Reference" "C2"
			(at 49.9872 273.1516 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "33uF ±20% 25V "
			(at 49.9872 275.463 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_Elec_5x5.4"
			(at 47.9552 278.13 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 46.99 274.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 46.99 274.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "EEEHBE330UAR"
			(at -2.54 497.84 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C336470"
			(at 0 548.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "45c1c995-aa13-4c66-89d3-67225e7b9964")
		)
		(pin "2"
			(uuid "e89a51b0-fc0d-4f2c-9806-efd0ca5572ea")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 46.99 279.4 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d3ec7c5")
		(property "Reference" "#PWR05"
			(at 46.99 285.75 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 47.117 283.7942 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 46.99 279.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 46.99 279.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 46.99 279.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "9f1fe18f-2bd7-4057-aa9a-d10445798ec7")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR05")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 372.11 49.53 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d52c75f")
		(property "Reference" "C23"
			(at 374.65 49.53 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "10n"
			(at 369.57 49.53 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 372.11 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 372.11 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 372.11 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B103KC8NNNC"
			(at 744.22 0 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C84709"
			(at 372.11 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "b48c15d2-897f-4679-b965-2bc455b454b4")
		)
		(pin "2"
			(uuid "78b5d4ea-a6d7-4159-b9c6-62cd602a6d90")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C23")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 363.22 49.53 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d55c380")
		(property "Reference" "C22"
			(at 365.76 49.53 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "1u"
			(at 360.68 49.53 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 363.22 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 363.22 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 363.22 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10A105KO8NNNC"
			(at 726.44 0 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1592"
			(at 363.22 49.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "3c85f8f7-a288-41ac-b62d-e85f5c0558ee")
		)
		(pin "2"
			(uuid "e8faad61-a9f7-4e07-9b2f-5c235af4574e")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C22")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 372.11 54.61 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d58cdd4")
		(property "Reference" "#PWR051"
			(at 372.11 60.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 372.237 59.0042 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 372.11 54.61 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 372.11 54.61 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 372.11 54.61 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "c911b3ae-e1aa-4be5-86d0-ec945d1a03d8")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR051")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:INDUCTOR-pspice")
		(at 363.22 38.1 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d61d5e4")
		(property "Reference" "L2"
			(at 365.2012 36.9316 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "10uH"
			(at 365.2012 39.243 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Inductor_SMD:L_0805_2012Metric"
			(at 363.22 38.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 363.22 38.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 363.22 38.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "LB2012T100M"
			(at 325.12 -325.12 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C223248"
			(at 363.22 38.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "7af10bee-1b80-4914-9deb-11b2b69f180e")
		)
		(pin "2"
			(uuid "7fb23080-b865-491e-9b59-ebf18fcb0f3e")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "L2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 363.22 29.21 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d61d773")
		(property "Reference" "#PWR050"
			(at 363.22 33.02 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 360.68 25.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 363.22 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 363.22 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 363.22 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "c44231c2-04ec-4c35-b42a-705b4adb92e3")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR050")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:LED")
		(at 139.7 218.44 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d64ea5f")
		(property "Reference" "D3"
			(at 142.6972 217.4748 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "LED_red"
			(at 142.6972 219.7862 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "LED_SMD:LED_0603_1608Metric"
			(at 139.7 218.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 139.7 218.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 139.7 218.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "LTST-C193KRKT-5A"
			(at 220.98 600.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C157741"
			(at 139.7 218.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "42a445eb-2270-45f9-8fb6-8cf179c9e89c")
		)
		(pin "2"
			(uuid "a55f54de-8861-428b-96c5-095bed11e301")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "D3")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 139.7 208.28 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d67ff6d")
		(property "Reference" "R3"
			(at 141.478 207.1116 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "1.2k"
			(at 141.478 209.423 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 137.922 208.28 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 139.7 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 139.7 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403420"
			(at 139.7 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3GEYJ122V"
			(at 139.7 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "18d7a9c3-3b2d-4ac0-953a-e2d769ad11ae")
		)
		(pin "2"
			(uuid "c2409ce1-c059-4131-b25b-9ad5ee8cfc58")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R3")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 179.07 45.72 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d7b7f01")
		(property "Reference" "C10"
			(at 177.8 43.18 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 181.61 45.72 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 179.07 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 179.07 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 179.07 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 471.17 -63.5 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 179.07 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "bbe1ffb2-c606-439b-b1f5-0e4a21034eb2")
		)
		(pin "2"
			(uuid "1fb592d0-0672-48c5-9c34-4e5de0ae319d")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C10")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 96.52 168.91 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d7c46fc")
		(property "Reference" "#PWR08"
			(at 96.52 175.26 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 96.647 173.3042 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 96.52 168.91 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 96.52 168.91 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 96.52 168.91 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "0a45e975-6fe6-4093-af74-aef38d9224c1")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR08")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 101.6 80.01 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d7c607f")
		(property "Reference" "#PWR09"
			(at 101.6 83.82 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 101.981 75.6158 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 101.6 80.01 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 101.6 80.01 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 101.6 80.01 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "bf62a636-42f3-4da3-bf7a-194ce289da8f")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR09")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_name "NINA-B311-00B:NINA-B311-00B")
		(lib_id "NINA-B311-00B:NINA-B311-00B")
		(at 64.77 124.46 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d7d5fef")
		(property "Reference" "U3"
			(at 64.77 77.0382 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "NINA-B311-00B"
			(at 64.77 79.3496 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "lib_fp:XCVR_NINA-B312-00B"
			(at 64.77 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Datasheet" "NINA-B312-00B"
			(at 64.77 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 64.77 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Field4" "BLUETOOTH LOW ENERGY MODULE STAN"
			(at 64.77 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field5" "Unavailable"
			(at 64.77 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field6" "None"
			(at 64.77 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field7" "U-Blox America Inc."
			(at 64.77 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field8" "SMD-55 U-Blox America Inc."
			(at 64.77 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "MPN" "NINA-B311-00B"
			(at 0 248.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "10"
			(uuid "8d7f709e-3c25-4c7c-bc34-91b43f9b4153")
		)
		(pin "1"
			(uuid "d373d1eb-efb8-4ada-a907-15a21a7996d7")
		)
		(pin "12"
			(uuid "f3a17dc0-d3f1-4d85-bdc0-935e07aaf905")
		)
		(pin "13"
			(uuid "adcb6f64-cadd-45f2-885f-177226637acc")
		)
		(pin "14"
			(uuid "bfe80dcf-e6b0-469d-8b15-f7b2fb47d885")
		)
		(pin "16"
			(uuid "0f38d548-4e7a-4906-9bda-318dd6070f3d")
		)
		(pin "17"
			(uuid "cca9f9a9-3517-47d2-9f24-8a9715f1451c")
		)
		(pin "18"
			(uuid "ea00c4be-6437-48f5-ba0c-233ec400ba68")
		)
		(pin "19"
			(uuid "bcaec4c4-d9ce-4396-af45-635f6a074f5c")
		)
		(pin "2"
			(uuid "75acb326-6ac3-4e85-a8e0-8fd51a417e2d")
		)
		(pin "20"
			(uuid "fc5e8c98-5358-4050-9f90-3efb7c1bd94b")
		)
		(pin "21"
			(uuid "d87dcca5-7523-40d3-9457-d76fc0e9dac1")
		)
		(pin "22"
			(uuid "62b6f889-9e1c-43e4-9a29-0df40882cc17")
		)
		(pin "23"
			(uuid "dd99af5c-c5ff-4fe8-80e5-98c28a86d94e")
		)
		(pin "24"
			(uuid "dec63347-cfe3-4906-99c5-6ca85612bf87")
		)
		(pin "25"
			(uuid "3be696fe-9fa6-4363-8bf9-2f2f8d3b6942")
		)
		(pin "26"
			(uuid "2bff0379-68c7-49e8-8102-558001f37153")
		)
		(pin "27"
			(uuid "a4e0435c-f451-495c-9f11-bdd7a62f2774")
		)
		(pin "28"
			(uuid "1871d4cf-0282-43c4-8d69-ecd25a741705")
		)
		(pin "29"
			(uuid "2ce2ee57-a89e-4375-9692-b60b9066acdd")
		)
		(pin "3"
			(uuid "884d4cb7-c57b-4f4e-a932-f732f3bd2819")
		)
		(pin "30"
			(uuid "77e0fc35-2da9-4f23-9969-eab499926612")
		)
		(pin "32"
			(uuid "164b6747-f74a-42f5-ba91-8872d96550f6")
		)
		(pin "33"
			(uuid "a2c1b5e8-2046-4313-8f40-c037aa51333d")
		)
		(pin "34"
			(uuid "a1c508f2-13ff-48f4-b518-afa43691f4d8")
		)
		(pin "35"
			(uuid "bc7c31a4-5fef-403c-9b22-4b1c014c04c3")
		)
		(pin "36"
			(uuid "c34a36eb-2925-4a9e-90fc-7dd713d67fa2")
		)
		(pin "37"
			(uuid "0d83276e-d739-46aa-8033-49473602330e")
		)
		(pin "38"
			(uuid "ef0edf9d-4cec-4efd-83ac-94c78a42aad1")
		)
		(pin "39"
			(uuid "69bca07f-233c-4b94-a3e9-736eae3adace")
		)
		(pin "4"
			(uuid "04c3348c-019a-46f3-950a-167707e6a859")
		)
		(pin "40"
			(uuid "8443b11a-fedf-41db-9c71-3cc76d30f9a4")
		)
		(pin "41"
			(uuid "726a708c-fc02-4951-8ea9-5d7089dd5a56")
		)
		(pin "42"
			(uuid "c6bccf20-691c-4e3c-b89e-f148fe609bad")
		)
		(pin "43"
			(uuid "75c8d96d-3d96-4832-b7c8-8829d0a77312")
		)
		(pin "44"
			(uuid "506b35eb-d8db-47f3-b7c2-fd5eddf6a0ef")
		)
		(pin "45"
			(uuid "a890fed7-5c33-4fc8-b3b8-7fcef321e6c2")
		)
		(pin "46"
			(uuid "33a1be8c-dbbb-435d-9aeb-2afd9282f4f9")
		)
		(pin "47"
			(uuid "5ce4e730-0456-4031-8f99-473b7f31ff67")
		)
		(pin "48"
			(uuid "895a61d6-ef3b-478f-ad22-8f3be5e83461")
		)
		(pin "49"
			(uuid "449bdcd6-26ab-4881-8c15-d11f1292fd3a")
		)
		(pin "5"
			(uuid "03d29a8a-29c1-4ae1-bcf7-5e8911c3271c")
		)
		(pin "50"
			(uuid "cb788660-3e55-448c-ae1d-506f4954aed7")
		)
		(pin "51"
			(uuid "e3b6e59c-027d-4100-a1d6-0e660ec24028")
		)
		(pin "52"
			(uuid "47f32b6f-7d92-4324-a5d3-b2c22298c25a")
		)
		(pin "53"
			(uuid "9806d5f1-b752-4705-84d8-b21fdaee59eb")
		)
		(pin "6"
			(uuid "3edcb1a4-cdd3-4e7c-8076-0fa1ac1db77a")
		)
		(pin "7"
			(uuid "fd3315c0-fcd1-4b0c-8d7b-5a8414136949")
		)
		(pin "8"
			(uuid "f609828c-72cc-421d-88c6-5628460d1f4a")
		)
		(pin "9"
			(uuid "381fc8c6-cec8-4bc8-9603-62a46870b932")
		)
		(pin "EGP1"
			(uuid "f2408599-1b57-43b6-aee7-6d9b43c32a9f")
		)
		(pin "EGP10"
			(uuid "a49ed514-34a9-4fe8-a0a9-5dce87d774f5")
		)
		(pin "EGP11"
			(uuid "a2f03e7b-646e-4482-9c39-7d03d7236e06")
		)
		(pin "EGP12"
			(uuid "48c7f41f-d110-4d42-9c6c-81c8a9f03d7a")
		)
		(pin "EGP2"
			(uuid "521233f4-fd3c-46e9-b723-1177d02ad152")
		)
		(pin "EGP3"
			(uuid "39d8fdee-d73d-4627-82e6-9f0e5163721b")
		)
		(pin "EGP4"
			(uuid "ebdc3672-9e86-45ec-a6a4-777a1135f9f8")
		)
		(pin "EGP5"
			(uuid "bb3d4377-2897-4cc5-bb31-10cc80ad0a2c")
		)
		(pin "EGP6"
			(uuid "02f3bb57-2085-45e6-a6bb-f8fa800ab2bf")
		)
		(pin "EGP7"
			(uuid "e1886153-44d4-4f01-97a2-f52815d889d5")
		)
		(pin "EGP8"
			(uuid "477e11d1-ac21-46be-90bc-33224ca6f7d3")
		)
		(pin "EGP9"
			(uuid "d8a716cc-e33f-42f4-8f09-ca40c0979e4d")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U3")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_name "SHT31-DIS-B:SHT31-DIS-B")
		(lib_id "SHT31-DIS-B:SHT31-DIS-B")
		(at 149.86 45.72 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d7e3a8c")
		(property "Reference" "U6"
			(at 149.86 33.8582 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "SHT31-DIS-B"
			(at 149.86 36.1696 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "lib_fp:SON50P250X250X100-9N"
			(at 149.86 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Datasheet" "SHT31 Series 5.5 V 800 µA Surface Mount Humidity and Temperature Sensor"
			(at 149.86 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 149.86 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Field4" "Sensirion AG"
			(at 149.86 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field5" "None"
			(at 149.86 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field6" "Unavailable"
			(at 149.86 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field7" "TDFN-8 Sensirion"
			(at 149.86 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field8" "SHT31-DIS-B"
			(at 149.86 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "MPN" "SHT31-DIS-B"
			(at 0 91.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "2"
			(uuid "a16c1f09-9577-4a63-b386-7e5dbd841305")
		)
		(pin "1"
			(uuid "86fccd35-169d-4928-a522-0a6fd63d1cb5")
		)
		(pin "3"
			(uuid "17e91b06-47c6-4149-8a4c-d8b26c1b9754")
		)
		(pin "4"
			(uuid "8b6d122d-c14b-4773-bb84-f2798a057ffc")
		)
		(pin "5"
			(uuid "1dbb1698-6fd1-4436-9442-271042672bf6")
		)
		(pin "6"
			(uuid "df81c71a-91cb-4a27-ad2e-46a48b186670")
		)
		(pin "7"
			(uuid "f8152466-4f07-43ad-a1f8-69ac40991058")
		)
		(pin "8"
			(uuid "1e9e54f0-6a83-4b19-96de-fa407da47c5b")
		)
		(pin "9"
			(uuid "0a661c3d-9000-4023-bc93-f3343e886526")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U6")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_name "SAM-M8Q:SAM-M8Q")
		(lib_id "SAM-M8Q:SAM-M8Q")
		(at 55.88 43.18 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d7e49a3")
		(property "Reference" "U2"
			(at 55.88 21.209 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "SAM-M8Q"
			(at 55.88 23.5204 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "lib_fp:XCVR_SAM-M8Q"
			(at 55.88 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Datasheet" "SAM-M8Q"
			(at 55.88 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 55.88 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Field4" "u-Blox M8 Gnss Antenna Module"
			(at 55.88 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field5" "Unavailable"
			(at 55.88 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field6" "None"
			(at 55.88 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field7" "U-Blox America"
			(at 55.88 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "Field8" "SMD-20 U-Blox America"
			(at 55.88 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left bottom)
				(hide yes)
			)
		)
		(property "MPN" "SAM-M8Q-0-10"
			(at 0 86.36 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "10"
			(uuid "707c89ac-8b56-4bd1-9888-3258a58ac2ed")
		)
		(pin "11"
			(uuid "3f122944-600c-4de6-88ab-75d151d0bdc9")
		)
		(pin "12"
			(uuid "0b6d16c1-8965-4dfb-aefa-8b65645e4b6f")
		)
		(pin "13"
			(uuid "f9c59e07-0f84-4c57-8443-aa9be62a57b0")
		)
		(pin "14"
			(uuid "4426159b-6311-4dc9-bb6b-15dbfe0bb4f9")
		)
		(pin "15"
			(uuid "0fe49d33-4ea2-460a-8bcc-2b5837c54770")
		)
		(pin "16"
			(uuid "62d80e59-8a2c-4844-9230-abd2b7b08035")
		)
		(pin "17"
			(uuid "4ead2bf0-858b-4e77-a003-18e29a7c33e8")
		)
		(pin "18"
			(uuid "68a98e2a-bb06-48dd-b401-ed563e9b7479")
		)
		(pin "19"
			(uuid "81932ef9-0e7b-45b4-bfef-dc07b40cbc34")
		)
		(pin "2"
			(uuid "cbc32da2-b792-4229-ba49-a1310e306269")
		)
		(pin "20"
			(uuid "98b1fbed-798f-40d4-aa78-0e8add423cb2")
		)
		(pin "3"
			(uuid "d6f88bc3-1480-4c86-99ac-1ca80d3758bd")
		)
		(pin "4"
			(uuid "2406912c-2655-4ee7-8c78-dc93a9c10b0b")
		)
		(pin "5"
			(uuid "28b0a047-e6a3-495f-a90d-032e2de15d8f")
		)
		(pin "6"
			(uuid "09f123f4-90cd-45c2-87b2-739d36a516a9")
		)
		(pin "7"
			(uuid "c4c1dfcf-a38b-43fb-afcc-15194193be6d")
		)
		(pin "8"
			(uuid "abf0cbe2-d304-4808-acc9-f6ef0bcce81c")
		)
		(pin "9"
			(uuid "40aa43d7-dacd-4d83-9470-b605684e1bfb")
		)
		(pin "1"
			(uuid "0f4849b1-cb61-49da-bb51-d03d18b6411d")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 106.68 90.17 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d7e7a6b")
		(property "Reference" "C5"
			(at 105.41 87.63 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 109.22 90.17 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 106.68 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 106.68 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 106.68 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 398.78 -19.05 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 106.68 90.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "7e044f97-14b3-41d8-8685-5578bc3c95b5")
		)
		(pin "2"
			(uuid "b025e6ea-3aa2-401c-93cb-4017cd026c35")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C5")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 179.07 52.07 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d8008b1")
		(property "Reference" "#PWR022"
			(at 179.07 58.42 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 179.197 56.4642 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 179.07 52.07 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 179.07 52.07 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 179.07 52.07 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "643e5cb4-7b6c-4ab6-a5d0-64e5637f2ac6")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR022")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 179.07 39.37 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d812f82")
		(property "Reference" "#PWR021"
			(at 179.07 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 179.451 34.9758 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 179.07 39.37 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 179.07 39.37 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 179.07 39.37 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "f957cd9c-a875-496e-8961-5c8b24720485")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR021")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 128.27 40.64 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d82690a")
		(property "Reference" "#PWR013"
			(at 121.92 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 125.0188 40.767 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" ""
			(at 128.27 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 128.27 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 128.27 40.64 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "5929cedb-6b10-47c2-b6be-6716fbe0cb56")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR013")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 106.68 92.71 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d83c37c")
		(property "Reference" "#PWR010"
			(at 106.68 99.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 106.807 97.1042 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 106.68 92.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 106.68 92.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 106.68 92.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "d8388c2a-c07b-4108-873d-cf85978b29ee")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR010")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+5V-power")
		(at 119.38 119.38 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d95f906")
		(property "Reference" "#PWR018"
			(at 119.38 123.19 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+5V"
			(at 119.761 114.9858 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 119.38 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 119.38 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 119.38 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "c43a6c1e-85dd-4a5f-a148-b4447db1725e")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR018")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 119.38 124.46 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005d9744b9")
		(property "Reference" "#PWR019"
			(at 119.38 130.81 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 119.507 128.8542 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 119.38 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 119.38 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 119.38 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "41a4bc9e-7422-410d-a21f-4c2ac69b1651")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR019")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Switch:SW_Push")
		(at 226.06 57.15 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005daa00c5")
		(property "Reference" "SW1"
			(at 226.06 49.911 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "SW_Push"
			(at 226.06 52.2224 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Button_Switch_SMD:SW_SPST_B3U-1000P"
			(at 226.06 52.07 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 226.06 52.07 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 226.06 57.15 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C231329"
			(at 226.06 57.15 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "B3U-1000P"
			(at 226.06 57.15 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "1e54cf48-8ad2-400e-83e0-4075268e80a3")
		)
		(pin "2"
			(uuid "6e69dd24-628f-47ff-af2a-661673fbe25a")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "SW1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:MCP73831-2-OT-Battery_Management")
		(at 125.73 215.9 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005daa1da0")
		(property "Reference" "U4"
			(at 125.73 203.7588 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "MCP73831-2-OT"
			(at 115.57 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-23-5"
			(at 127 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
					(italic yes)
				)
				(justify left)
				(hide yes)
			)
		)
		(property "Datasheet" "http://ww1.microchip.com/downloads/en/DeviceDoc/20001984g.pdf"
			(at 121.92 217.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 125.73 215.9 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "MCP73831T-2ATI/OT"
			(at 0 431.8 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C14879"
			(at 125.73 215.9 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "6ef41d6f-4b42-454c-8d92-77253c0187a3")
		)
		(pin "2"
			(uuid "190bfaf9-ebf8-4b03-9df6-0c424a8f1104")
		)
		(pin "3"
			(uuid "c2e916f1-12f3-4ff1-9fb2-8595076bdb45")
		)
		(pin "4"
			(uuid "6169cfee-3dc4-452e-9875-3b6a2f7ff750")
		)
		(pin "5"
			(uuid "bc4423e8-6e91-4097-93ff-355ac8bc6e0a")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U4")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 236.22 81.28 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005daccfab")
		(property "Reference" "#PWR028"
			(at 236.22 87.63 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 236.347 85.6742 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 236.22 81.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 236.22 81.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 236.22 81.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "038fe1c3-aca8-4b85-ace8-a42197adbb54")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR028")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:Q_PMOS_GSD")
		(at 31.75 259.08 0)
		(mirror x)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dace001")
		(property "Reference" "Q1"
			(at 36.957 257.9116 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "DMG3415U-7"
			(at 36.957 260.223 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-23"
			(at 36.83 261.62 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 31.75 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 31.75 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "DMG3415U-7"
			(at 0 0 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C459537"
			(at 31.75 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN2" "DMG3415UQ-7"
			(at 31.75 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "e1e8384e-d92b-41a6-93ca-c8419cd99db2")
		)
		(pin "2"
			(uuid "89b12d3e-d869-4606-a746-3cf290a90957")
		)
		(pin "3"
			(uuid "90a2d879-ef72-420f-b609-bf0d497fbb5a")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "Q1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:MCP1640BCH-Regulator_Switching")
		(at 143.51 262.89 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db07a0e")
		(property "Reference" "U5"
			(at 143.51 251.0282 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "MCP1624T"
			(at 143.51 253.3396 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-23-6"
			(at 144.78 269.24 0)
			(effects
				(font
					(size 1.27 1.27)
					(italic yes)
				)
				(justify left)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 137.16 251.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 143.51 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "MCP1624T-I/CHY"
			(at 0 525.78 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C128443"
			(at 143.51 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "135b13b5-1d9a-4524-8559-ccc34a31959e")
		)
		(pin "2"
			(uuid "bad200eb-cbf6-4756-9b57-040e9d4eaf3d")
		)
		(pin "3"
			(uuid "98fcf6d1-76cb-4ecd-8dad-8eefeae93d52")
		)
		(pin "4"
			(uuid "ca5f99f1-0470-4524-8ac6-7aa48e9e0ee4")
		)
		(pin "5"
			(uuid "3207bd3a-6bb3-4954-a132-1ac1754017e0")
		)
		(pin "6"
			(uuid "c21f11d2-0d0c-450f-b86b-67c4ac875bf4")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U5")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C")
		(at 111.76 265.43 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db0be8b")
		(property "Reference" "C4"
			(at 114.681 264.2616 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "4u7"
			(at 114.681 266.573 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 110.7948 261.62 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 111.76 265.43 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 111.76 265.43 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10A475KA8NQNC"
			(at 223.52 0 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C69335"
			(at 111.76 265.43 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "70c0247c-d920-442c-a4c2-764a20daa6e9")
		)
		(pin "2"
			(uuid "0e287d90-2fad-412a-a703-6c3164236a73")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C4")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:Ferrite_Bead-Device")
		(at 83.82 45.72 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db18798")
		(property "Reference" "FB2"
			(at 87.63 49.53 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "Ferrite_Bead"
			(at 83.82 50.8 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Inductor_SMD:L_0603_1608Metric"
			(at 83.82 43.942 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 83.82 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 83.82 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "BLM15HD102SN1D"
			(at 83.82 45.72 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C21516"
			(at 83.82 45.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "3bf6a5bd-ea45-48c0-8d38-b118dbab8f9a")
		)
		(pin "2"
			(uuid "f5825e57-c186-427e-b1ab-e1be8bbee811")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "FB2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:AP2112K-3.3-Regulator_Linear")
		(at 81.28 262.89 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db24ec6")
		(property "Reference" "U1"
			(at 81.28 254.2032 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "AP2112K-3.3"
			(at 81.28 256.5146 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-23-5"
			(at 81.28 254.635 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "https://www.diodes.com/assets/Datasheets/AP2112.pdf"
			(at 81.28 260.35 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 81.28 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "AP2112K-3.3TRG1"
			(at 0 525.78 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C51118"
			(at 81.28 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "240d597b-1b08-462c-a305-86fbceca0c61")
		)
		(pin "2"
			(uuid "9046c774-e0d8-4277-9ccf-5e1d0f3fcbe5")
		)
		(pin "3"
			(uuid "3318e8f5-0d75-45e5-b99c-0392ccd3b426")
		)
		(pin "4"
			(uuid "72b81c07-a319-4a90-bfcc-1338f1894f92")
		)
		(pin "5"
			(uuid "fbc3abf7-2623-4c20-80f6-e65d5980fa19")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+BATT-power")
		(at 34.29 252.73 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db26168")
		(property "Reference" "#PWR04"
			(at 34.29 256.54 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+BATT"
			(at 34.671 248.3358 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 34.29 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 34.29 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 34.29 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "45a8d735-619d-4ace-ba5d-8dfbe1c37241")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR04")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "DW01:DW01")
		(at 58.42 217.17 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db2c400")
		(property "Reference" "U9"
			(at 58.42 205.0288 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "DW01C-G"
			(at 58.42 207.3402 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-23-6"
			(at 58.42 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "https://datasheet.lcsc.com/szlcsc/1810081612_Fortune-Semicon-DW01C-G_C35306.pdf"
			(at 52.07 212.09 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 58.42 217.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "DW01C-G"
			(at 0 434.34 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C35306"
			(at 58.42 217.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "11c2fbf5-df6f-4eac-92c1-b190720d0091")
		)
		(pin "2"
			(uuid "dadc438a-1bbe-4995-b1c9-2dda2634e899")
		)
		(pin "3"
			(uuid "80804c2a-ebda-4b87-a400-c63241b89ab7")
		)
		(pin "4"
			(uuid "c80828d9-903d-45ce-9d97-76340f9e5055")
		)
		(pin "5"
			(uuid "51ff2895-bd6c-42a2-9710-3d9570cb4014")
		)
		(pin "6"
			(uuid "4f2e9825-b3a1-409c-8962-0d3eb6585d02")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U9")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 36.83 219.71 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db4f121")
		(property "Reference" "C24"
			(at 35.56 217.17 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "1u"
			(at 39.37 219.71 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 36.83 219.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 36.83 219.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 36.83 219.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1592"
			(at 36.83 219.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10A105KO8NNNC"
			(at 36.83 219.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "a2539129-e116-412e-af24-b4d4b6019e0d")
		)
		(pin "2"
			(uuid "63f31989-dbe7-48a3-9163-e4bc08588501")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C24")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:Conn_01x04_Female-Connector")
		(at 146.05 119.38 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db554a8")
		(property "Reference" "J1"
			(at 146.7358 119.9896 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "Conn_01x04_Female"
			(at 127 127 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "lib_fp:Grove_1x04"
			(at 146.05 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 146.05 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 146.05 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "1125R-4p"
			(at 0 238.76 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "110990037"
			(at 0 238.76 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Field4" "NOTE: MPN is for 10 pieces!"
			(at 0 238.76 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "98f5df41-a887-4d36-b2da-e9d16c65bf35")
		)
		(pin "2"
			(uuid "ebb6e961-bb0f-49f4-9215-fd46093a00cd")
		)
		(pin "3"
			(uuid "387f0645-261b-4639-8ba8-30340cca214a")
		)
		(pin "4"
			(uuid "092bc677-0c7c-4de5-84c6-f16b4ad549be")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "J1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 236.22 190.5 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db58999")
		(property "Reference" "#PWR0108"
			(at 236.22 196.85 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 236.347 193.7512 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" ""
			(at 236.22 190.5 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 236.22 190.5 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 236.22 190.5 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "a2c7ed30-49c7-405b-ab60-a28a5d84002d")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0108")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:Ferrite_Bead-Device")
		(at 83.82 43.18 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db5d9a1")
		(property "Reference" "FB1"
			(at 81.28 41.91 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "Ferrite_Bead"
			(at 85.09 39.37 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Inductor_SMD:L_0603_1608Metric"
			(at 83.82 41.402 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 83.82 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 83.82 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "BLM15HD102SN1D"
			(at 83.82 43.18 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C21516"
			(at 83.82 43.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "68865c0d-eb39-4fd6-a273-032d4c6019b0")
		)
		(pin "2"
			(uuid "b5aa501d-ba82-4f0b-990e-d1b972bccf95")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "FB1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:D_Schottky")
		(at 25.4 267.97 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db69662")
		(property "Reference" "D1"
			(at 26.5684 269.9766 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "MBR120"
			(at 24.257 269.9766 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Diode_SMD:D_SOD-123F"
			(at 25.4 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 25.4 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 25.4 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "MBR120ESFT1G"
			(at 25.4 267.97 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C236132"
			(at 25.4 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "c67163d3-16a7-44c3-b0c2-c6dc3f1edfdb")
		)
		(pin "2"
			(uuid "9dc9de50-f643-487a-b445-83d81613c091")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "D1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 96.52 266.7 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db6a2ad")
		(property "Reference" "C3"
			(at 95.25 264.16 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "1u"
			(at 99.06 266.7 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 96.52 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 96.52 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 96.52 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1592"
			(at 96.52 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10A105KO8NNNC"
			(at 96.52 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "652c0d36-8492-4e80-b604-b95ce5b43763")
		)
		(pin "2"
			(uuid "dc9de65c-59b9-4529-8d5e-f2df2baa6252")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C3")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 66.04 266.7 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db6b806")
		(property "Reference" "C1"
			(at 64.77 264.16 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "1u"
			(at 68.58 266.7 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 66.04 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 66.04 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 66.04 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1592"
			(at 66.04 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10A105KO8NNNC"
			(at 66.04 266.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "8267997c-0f83-4b6c-abe6-dd625d3c1203")
		)
		(pin "2"
			(uuid "45410299-8f39-4df3-bf98-c452506accf6")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 81.28 274.32 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db6bf91")
		(property "Reference" "#PWR03"
			(at 81.28 280.67 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 81.407 278.7142 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 81.28 274.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 81.28 274.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 81.28 274.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "92fc8a85-d13d-49b5-bdb9-8c4b4751b7ee")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR03")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 143.51 280.67 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db87cc5")
		(property "Reference" "#PWR014"
			(at 143.51 287.02 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 143.637 285.0642 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 143.51 280.67 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 143.51 280.67 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 143.51 280.67 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "5e41c677-091c-4bc2-8844-19585f17587c")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR014")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 20.32 279.4 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005db91031")
		(property "Reference" "#PWR02"
			(at 20.32 285.75 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 20.447 283.7942 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 20.32 279.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 20.32 279.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 20.32 279.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "b37ff38f-d0e5-4686-bcea-d0220ed8151c")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR02")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 167.64 262.89 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dba2dec")
		(property "Reference" "R4"
			(at 169.418 261.7216 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "976k"
			(at 169.418 264.033 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 165.862 262.89 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 167.64 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 167.64 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3EKF9763V"
			(at -72.39 368.3 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403409"
			(at 167.64 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "1c7baac2-67c0-49ac-9bcc-65f8b1250195")
		)
		(pin "2"
			(uuid "e30424c7-6baa-46c8-984e-76d47ac34c42")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R4")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 167.64 271.78 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dba2df4")
		(property "Reference" "R5"
			(at 169.418 270.6116 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "309k"
			(at 169.418 272.923 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 165.862 271.78 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 167.64 271.78 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 167.64 271.78 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3EKF3093V"
			(at -72.39 377.19 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403149"
			(at 167.64 271.78 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "467054c9-cf8c-4466-8f29-136dca51a731")
		)
		(pin "2"
			(uuid "3df0d2a3-0b3c-47f2-912d-84bcb5fbbc20")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R5")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 43.18 214.63 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dbab2fb")
		(property "Reference" "R13"
			(at 42.0116 212.852 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "430R"
			(at 44.323 212.852 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 43.18 216.408 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 43.18 214.63 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 43.18 214.63 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "AC0603JR-07430RL"
			(at 124.46 586.74 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C228199"
			(at 43.18 214.63 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "1448dd0f-23f3-4910-961b-28d748989f69")
		)
		(pin "2"
			(uuid "f1c9b1e7-581a-498d-9f8e-8b6ff045303f")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R13")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R_Small")
		(at 391.16 222.25 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dbc57e5")
		(property "Reference" "R19"
			(at 392.6586 221.0816 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "DNP"
			(at 392.6586 223.393 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 391.16 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 391.16 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 391.16 222.25 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "57abb50a-f09d-42e0-863d-1d9b60d62ec9")
		)
		(pin "2"
			(uuid "2ccfd51b-5ae2-4c08-b7a2-4f189bace5a7")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R19")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R_Small")
		(at 391.16 231.14 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dbc5dd3")
		(property "Reference" "R20"
			(at 392.6586 229.9716 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "DNP"
			(at 392.6586 232.283 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 391.16 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 391.16 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 391.16 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "21c4fab3-0afe-43ef-b4a0-f75ac1b680a8")
		)
		(pin "2"
			(uuid "4b5a0559-a149-42fa-a3a3-1867f1f70625")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R20")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:PWR_FLAG-power")
		(at 46.99 267.97 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dbdad5b")
		(property "Reference" "#FLG0102"
			(at 46.99 266.065 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "PWR_FLAG"
			(at 46.99 263.5504 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 46.99 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 46.99 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 46.99 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "eedd082f-2b3d-4739-a8da-d1875a24045c")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#FLG0102")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:Conn_01x02_Female-Connector")
		(at 24.13 121.92 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dc14e14")
		(property "Reference" "J4"
			(at 26.8224 113.665 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "Conn_01x02_Female"
			(at 26.8224 115.9764 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Jumper:SolderJumper-2_P1.3mm_Open_RoundedPad1.0x1.5mm"
			(at 24.13 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 24.13 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 24.13 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "bae6b179-a18d-415f-ace0-0de1a593f971")
		)
		(pin "2"
			(uuid "f92aee62-2ccc-4ead-808f-0b1e7c5bb340")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "J4")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 344.17 219.71 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dc3369c")
		(property "Reference" "R21"
			(at 343.0016 217.932 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "DNP"
			(at 345.313 217.932 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 344.17 221.488 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 344.17 219.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 344.17 219.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "7164b331-ee75-4ed9-8d3e-48010ea17d34")
		)
		(pin "2"
			(uuid "eb8037dd-4595-4e79-bb54-dc497da936dc")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R21")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 386.08 226.06 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dc4cf9c")
		(property "Reference" "C6"
			(at 388.62 224.79 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 386.08 228.6 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 386.08 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 386.08 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 386.08 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 386.08 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 386.08 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "225d9338-6851-449f-9715-c5f3e1432789")
		)
		(pin "2"
			(uuid "798df337-c94f-4e2b-bf1f-66ba904f8444")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C6")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 91.44 25.4 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dc82abd")
		(property "Reference" "#PWR07"
			(at 91.44 29.21 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 91.821 21.0058 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 91.44 25.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 91.44 25.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 91.44 25.4 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "b0c6292b-26b5-448e-b592-e6554b1f5a8d")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR07")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 163.83 132.08 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd16076")
		(property "Reference" "R24"
			(at 165.608 130.9116 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "DNP"
			(at 165.608 133.223 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 162.052 132.08 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 163.83 132.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 163.83 132.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "ae0a6ce5-ae78-48ae-9781-423df4e9f18b")
		)
		(pin "2"
			(uuid "a561f1a2-8dd0-4f40-b267-1dd1bf6a49d7")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R24")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 179.07 132.08 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd17d64")
		(property "Reference" "R25"
			(at 180.848 130.9116 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "DNP"
			(at 180.848 133.223 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 177.292 132.08 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 179.07 132.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 179.07 132.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "3652a187-aa0d-4a30-bc5d-99e1fd55ef6a")
		)
		(pin "2"
			(uuid "16fe854a-9100-443e-b274-820cc8d15edc")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R25")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 55.88 234.95 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd27321")
		(property "Reference" "R14"
			(at 54.7116 233.172 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "1.2k"
			(at 57.023 233.172 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 55.88 236.728 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 55.88 234.95 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 55.88 234.95 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3GEYJ122V"
			(at 137.16 607.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403420"
			(at 55.88 234.95 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "1b02d9c6-1247-4949-b5b2-1f3727f50a71")
		)
		(pin "2"
			(uuid "53b9a77a-ae6b-4b7a-9002-62edbbac97f9")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R14")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 111.76 121.92 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd32bac")
		(property "Reference" "C11"
			(at 110.49 119.38 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 114.3 121.92 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 111.76 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 111.76 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 111.76 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 403.86 12.7 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 111.76 121.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "ab300160-e6be-4eb7-9789-391261e36745")
		)
		(pin "2"
			(uuid "3f0528a6-3f9b-46d5-b622-d1b72be8f68c")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C11")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+5V-power")
		(at 111.76 119.38 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd338a2")
		(property "Reference" "#PWR023"
			(at 111.76 123.19 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+5V"
			(at 112.141 114.9858 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 111.76 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 111.76 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 111.76 119.38 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "3fc4c9b2-434f-438e-ac95-8745a16e27d9")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR023")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 111.76 124.46 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd33ef9")
		(property "Reference" "#PWR024"
			(at 111.76 130.81 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 111.887 128.8542 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 111.76 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 111.76 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 111.76 124.46 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "98188429-1129-40bd-98e7-aea3f13e3b01")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR024")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 96.52 259.08 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd5191a")
		(property "Reference" "#PWR06"
			(at 96.52 262.89 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 96.901 254.6858 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 96.52 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 96.52 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 96.52 259.08 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "36241620-f0c1-4167-9b0e-e2d6dd36d079")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR06")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:Q_NMOS_GSD")
		(at 72.39 223.52 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd6b6dd")
		(property "Reference" "Q2"
			(at 76.2 220.98 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "NMOS"
			(at 64.77 229.87 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-23"
			(at 74.93 228.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 72.39 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 72.39 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ZXMN3F30FHTA"
			(at -151.13 151.13 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C12390"
			(at 72.39 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN2" "CJ2306"
			(at 72.39 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "64de8025-b9be-4ecf-8539-8ff75935cabb")
		)
		(pin "2"
			(uuid "97b95fba-fc38-4191-aef6-d11a6e3b7d29")
		)
		(pin "3"
			(uuid "245bd8ec-5360-4649-95f3-3adb7cdc8b80")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "Q2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 179.07 125.73 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dd7210e")
		(property "Reference" "#PWR0111"
			(at 179.07 129.54 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 179.451 121.3358 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 179.07 125.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 179.07 125.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 179.07 125.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "ad4c0252-c230-476b-9c44-9627083cf4df")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0111")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Switch:SW_Push")
		(at 260.35 60.96 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005ddafb3f")
		(property "Reference" "SW2"
			(at 260.35 53.721 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "SW_Push"
			(at 260.35 56.0324 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Button_Switch_SMD:SW_SPST_EVQP7C"
			(at 260.35 55.88 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 260.35 55.88 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 260.35 60.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "SKSCLCE010"
			(at 260.35 60.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C139799"
			(at 260.35 60.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "46a03c0e-a687-425d-abf3-64121b335e78")
		)
		(pin "2"
			(uuid "16d58d14-25eb-4a8f-bec9-3a7c35c9387d")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "SW2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "led_rgba:LED_BGRA")
		(at 156.21 91.44 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005ddd54c7")
		(property "Reference" "D7"
			(at 156.21 78.8162 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "LED_RGBA"
			(at 156.21 81.1276 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "LED_SMD:LED_RGB_1210"
			(at 156.21 92.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 156.21 92.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 156.21 91.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "150141M173100"
			(at 156.21 91.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C264607"
			(at 156.21 91.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "2"
			(uuid "65d254bb-23ad-4556-bfaf-a5d0a19ded52")
		)
		(pin "1"
			(uuid "4b9ffe6e-b268-4ff9-bd09-6b6e7fab5b8e")
		)
		(pin "3"
			(uuid "9d9a3b28-e8f8-4fca-afa7-64cc2bc79592")
		)
		(pin "4"
			(uuid "46e472a4-7b1d-4905-b195-3067e07a75b2")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "D7")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:L")
		(at 143.51 248.92 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005de520ac")
		(property "Reference" "L1"
			(at 143.51 244.094 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "4u7"
			(at 143.51 246.4054 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Inductor_SMD:L_Wuerth_MAPI-3010"
			(at 143.51 248.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 143.51 248.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 143.51 248.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "VLS3015ET-4R7M"
			(at 143.51 248.92 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C76865"
			(at 143.51 248.92 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "6f2abed0-30fd-49cb-8d02-d92f4cb9902d")
		)
		(pin "2"
			(uuid "d5cc73e2-bc6a-4988-8baf-a25e7551c523")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "L1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C")
		(at 182.88 267.97 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005de88891")
		(property "Reference" "C9"
			(at 185.801 266.8016 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "10u"
			(at 185.801 269.113 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0805_2012Metric"
			(at 181.9148 264.16 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 182.88 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 182.88 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C91245"
			(at 182.88 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL21A106MPFNNNE"
			(at 182.88 267.97 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "1d9ad70e-e735-496d-85f6-006ba35d5c61")
		)
		(pin "2"
			(uuid "ef5e95c0-a9b0-4d6f-9475-8d7ba2ce9fbc")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C9")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 260.35 66.04 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dead42f")
		(property "Reference" "C13"
			(at 264.16 64.77 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "100n"
			(at 256.54 64.77 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 260.35 66.04 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 260.35 66.04 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 260.35 66.04 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B104KB8NNNC"
			(at 313.69 377.19 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1591"
			(at 260.35 66.04 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "ff42503b-9fd8-4289-855d-087af023e121")
		)
		(pin "2"
			(uuid "d46ff5d2-6b38-4804-8818-e67f9f939c86")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C13")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 270.51 63.5 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005def9452")
		(property "Reference" "#PWR0107"
			(at 270.51 69.85 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 270.637 67.8942 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 270.51 63.5 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 270.51 63.5 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 270.51 63.5 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "189114bd-d398-4e4c-8c48-a80558b6f97c")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0107")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 143.51 86.36 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005defb13f")
		(property "Reference" "R15"
			(at 148.59 85.09 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "1.2k"
			(at 144.78 86.36 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 143.51 88.138 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 143.51 86.36 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 143.51 86.36 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3GEYJ122V"
			(at 224.79 458.47 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403420"
			(at 143.51 86.36 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "72751e22-4cfe-4466-ac5e-dfa7e162e648")
		)
		(pin "2"
			(uuid "c27065c7-f3d8-4113-afda-c9bab1451653")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R15")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 143.51 91.44 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005defbe09")
		(property "Reference" "R16"
			(at 148.59 90.17 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "1.2k"
			(at 144.78 91.44 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 143.51 93.218 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 143.51 91.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 143.51 91.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3GEYJ122V"
			(at 224.79 463.55 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403420"
			(at 143.51 91.44 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "d40943e6-9901-416e-bbe6-fcc890d1e0fe")
		)
		(pin "2"
			(uuid "2fe60fe0-109a-41de-8e9c-4dc961ba5678")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R16")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 143.51 96.52 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005defbfef")
		(property "Reference" "R17"
			(at 148.59 95.25 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "1.5k"
			(at 144.78 96.52 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 143.51 98.298 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 143.51 96.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 143.51 96.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" ""
			(at 224.79 468.63 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" ""
			(at 143.51 96.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "e3feebb0-5070-46b8-9cdc-d631919c2b55")
		)
		(pin "2"
			(uuid "139d8c31-fdf2-4fd2-a4ed-15aad036393a")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R17")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 97.79 226.06 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005df0ef61")
		(property "Reference" "#PWR0101"
			(at 104.14 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 102.1842 225.933 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 97.79 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 97.79 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 97.79 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "723e8669-7e59-400e-b9c6-10531320af31")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0101")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 123.19 147.32 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005df4fee3")
		(property "Reference" "R22"
			(at 120.65 148.59 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "0R"
			(at 123.19 148.59 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 121.412 147.32 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 123.19 147.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 123.19 147.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C253507"
			(at 123.19 147.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "PMR03EZPJ000"
			(at 123.19 147.32 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "eafbe594-0399-438c-b2a2-fe1d81fb09b0")
		)
		(pin "2"
			(uuid "174c3cf8-25ea-4d9e-93b5-d22a9e9e1099")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R22")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 123.19 157.48 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005df50fb9")
		(property "Reference" "R23"
			(at 120.65 158.75 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "DNP"
			(at 123.19 160.02 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 121.412 157.48 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 123.19 157.48 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 123.19 157.48 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "c1bfa922-8774-492a-a976-ad80fdccda0c")
		)
		(pin "2"
			(uuid "42b3dd9d-53c6-4977-ae1c-02ac91550717")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R23")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+BATT-power")
		(at 26.67 210.82 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005df55dfe")
		(property "Reference" "#PWR0102"
			(at 26.67 214.63 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+BATT"
			(at 27.051 206.4258 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 26.67 210.82 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 26.67 210.82 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 26.67 210.82 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "ce9aa00d-74cd-458d-b361-69572ac744a6")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0102")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+BATT-power")
		(at 167.64 199.39 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005df9d7ee")
		(property "Reference" "#PWR017"
			(at 167.64 203.2 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+BATT"
			(at 168.021 194.9958 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 167.64 199.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 167.64 199.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 167.64 199.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "f1a9919f-bdd6-4a55-a1b1-722439243238")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR017")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C")
		(at 153.67 220.98 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dfa11e7")
		(property "Reference" "C8"
			(at 156.591 219.8116 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "4u7"
			(at 156.591 222.123 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 152.7048 217.17 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 153.67 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 153.67 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10A475KA8NQNC"
			(at 307.34 0 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C69335"
			(at 153.67 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "4fec2081-cd73-4273-b7fd-62cc27d26a6c")
		)
		(pin "2"
			(uuid "b81af254-9dac-45a5-8a55-3a30e0698387")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C8")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:Battery_Cell")
		(at 26.67 220.98 0)
		(mirror y)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dfa23a4")
		(property "Reference" "BT1"
			(at 23.6728 218.5416 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "Battery_Cell"
			(at 23.6728 220.853 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Connector_JST:JST_PH_S2B-PH-K_1x02_P2.00mm_Horizontal"
			(at 26.67 219.456 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 26.67 219.456 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 26.67 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C64658"
			(at 53.34 441.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN3" "B2B-PH-SM4-TB(LF)(SN)"
			(at 53.34 441.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN2" "PH-2AW"
			(at 26.67 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "C64658"
			(at 26.67 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "a6adc164-9d39-4055-8ae5-41c80a20cc6c")
		)
		(pin "2"
			(uuid "978d3042-a1cd-4c17-bd0b-0dd66c9f286f")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "BT1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 167.64 229.87 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dfc9daf")
		(property "Reference" "#PWR016"
			(at 167.64 236.22 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 167.767 234.2642 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 167.64 229.87 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 167.64 229.87 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 167.64 229.87 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "b38ef05b-68c2-4bbf-b32c-fc1d45e3875f")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR016")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 123.19 163.83 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005dfd91ec")
		(property "Reference" "#PWR0112"
			(at 123.19 170.18 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 123.317 168.2242 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 123.19 163.83 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 123.19 163.83 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 123.19 163.83 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "aef7192e-a001-4be8-b5a1-64ec4bfaeed9")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0112")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 166.37 88.9 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e0079bf")
		(property "Reference" "#PWR0103"
			(at 166.37 92.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 166.751 84.5058 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 166.37 88.9 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 166.37 88.9 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 166.37 88.9 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "408221d8-5776-4ec3-87ad-c5d78c781518")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0103")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 226.06 64.77 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e02e367")
		(property "Reference" "R18"
			(at 224.8916 62.992 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "4.7k"
			(at 227.203 62.992 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 226.06 66.548 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 226.06 64.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 226.06 64.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJP03F4701V"
			(at 321.31 452.12 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C427306"
			(at 226.06 64.77 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "ae07c9e2-d177-4c1c-bad5-62adb33de797")
		)
		(pin "2"
			(uuid "09fe12a4-a95c-4f4f-910a-9fd6d5ab9b1c")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R18")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+5V-power")
		(at 182.88 256.54 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e060044")
		(property "Reference" "#PWR020"
			(at 182.88 260.35 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+5V"
			(at 183.261 252.1458 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 182.88 256.54 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 182.88 256.54 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 182.88 256.54 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "579f1ce1-f462-404d-805a-468098a77c22")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR020")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:VBUS-power")
		(at 125.73 199.39 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e0b31d4")
		(property "Reference" "#PWR011"
			(at 125.73 203.2 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "VBUS"
			(at 125.73 195.58 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 125.73 199.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 125.73 199.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 125.73 199.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "2a2a5bb4-6ad6-4a03-8441-c8a5a99b5bd3")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR011")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:uavcan_5pins-uavcan_connector")
		(at 332.74 226.06 0)
		(mirror x)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e0c7ea8")
		(property "Reference" "J3"
			(at 328.168 223.6216 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "DNP"
			(at 328.168 225.933 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "lib_fp_global:Molex_PicoBlade_53048-0510_1x05_P1.25mm_Horizontal"
			(at 328.93 226.06 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 328.93 226.06 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 332.74 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "0530480510"
			(at -8.89 0 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "129da498-973c-4134-bc36-3d8d6498736c")
		)
		(pin "2"
			(uuid "3fb8fdaf-8d00-44d4-983a-05115e8b4bc0")
		)
		(pin "3"
			(uuid "b9c71ee6-d54e-4295-ab11-18465f4eb0c9")
		)
		(pin "4"
			(uuid "02a8cccb-d81f-424c-807a-c888a4909787")
		)
		(pin "5"
			(uuid "9ed44449-bfac-4798-99fa-7b9677753b63")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "J3")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C")
		(at 151.13 203.2 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e0c897a")
		(property "Reference" "C7"
			(at 152.2984 206.121 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Value" "4u7"
			(at 149.987 206.121 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 154.94 202.2348 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 151.13 203.2 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 151.13 203.2 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10A475KA8NQNC"
			(at 354.33 354.33 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C69335"
			(at 151.13 203.2 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "d663cde7-a44d-46a0-9e19-e0f650b058e8")
		)
		(pin "2"
			(uuid "25abd61b-251a-4401-b62b-d32a65fd8446")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C7")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 157.48 205.74 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e0de4bb")
		(property "Reference" "#PWR015"
			(at 157.48 212.09 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 157.607 210.1342 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 157.48 205.74 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 157.48 205.74 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 157.48 205.74 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "668a8a4d-ceb0-49cb-88a4-526c05d7d2f7")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR015")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 110.49 223.52 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e0f5e92")
		(property "Reference" "R2"
			(at 112.268 222.3516 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "5.1k"
			(at 112.268 224.663 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 108.712 223.52 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 110.49 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 110.49 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403509"
			(at 110.49 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3GEYJ512V"
			(at 110.49 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "da817697-eea3-449d-82a8-e4379d62f057")
		)
		(pin "2"
			(uuid "7db26d49-a5fe-416e-b52e-6bffd6b1d178")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 236.22 54.61 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e10472c")
		(property "Reference" "#PWR0109"
			(at 236.22 58.42 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 240.03 50.8 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 236.22 54.61 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 236.22 54.61 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 236.22 54.61 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "9f1a5116-b804-4b42-a0f7-570358c8059c")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0109")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 236.22 67.31 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e12fb82")
		(property "Reference" "#PWR0110"
			(at 236.22 73.66 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 236.347 71.7042 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 236.22 67.31 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 236.22 67.31 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 236.22 67.31 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "7f7b518a-d046-4986-ae2b-48a5b0579ba3")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0110")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:Q_NMOS_GSD")
		(at 85.09 223.52 90)
		(mirror x)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e1b7bb0")
		(property "Reference" "Q3"
			(at 81.28 220.98 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "NMOS"
			(at 90.17 229.87 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-23"
			(at 82.55 228.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 85.09 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 85.09 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ZXMN3F30FHTA"
			(at 308.61 138.43 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C12390"
			(at 85.09 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN2" "CJ2306"
			(at 85.09 223.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "84315211-daee-41ab-986f-ee5e390090e9")
		)
		(pin "2"
			(uuid "774fc8d5-3c9f-4ff0-a2ef-0d38b2334303")
		)
		(pin "3"
			(uuid "4db171b2-326c-4ae3-8e34-352783ef0299")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "Q3")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Power_Protection:TPD3E001DRLR")
		(at 261.62 180.34 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e1f6c12")
		(property "Reference" "U10"
			(at 261.62 171.0182 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "TPD3E001DRLR"
			(at 261.62 173.3296 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Package_TO_SOT_SMD:SOT-553"
			(at 243.84 187.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "http://www.ti.com/lit/ds/symlink/tpd3e001.pdf"
			(at 256.54 173.99 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 261.62 180.34 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "TPD3E001DRLR"
			(at 0 360.68 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "33f754ef-b751-4936-9e6e-b47b99491992")
		)
		(pin "2"
			(uuid "aa429a6c-c0f0-4f27-90e9-cebb5bc99d5e")
		)
		(pin "3"
			(uuid "baa94a8d-488b-49c5-8a9b-d6969c23cac2")
		)
		(pin "4"
			(uuid "1e2a0c06-5747-4a93-aa49-42e1ecfd1fdc")
		)
		(pin "5"
			(uuid "483e8f16-b085-4d8b-830d-3a66ac7ae564")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "U10")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 355.6 231.14 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e2a115f")
		(property "Reference" "#PWR043"
			(at 355.6 237.49 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 355.727 235.5342 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 355.6 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 355.6 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 355.6 231.14 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "aea575ed-6b23-447f-b5ad-a304774cfa6d")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR043")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:USB_B_Micro-Connector")
		(at 220.98 176.53 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e2db5cc")
		(property "Reference" "J2"
			(at 222.377 164.6682 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "USB_B_Micro"
			(at 222.377 166.9796 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Connector_USB:USB_Micro-B_Molex-105017-0001"
			(at 224.79 177.8 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 224.79 177.8 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 220.98 176.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "1050170001"
			(at 220.98 176.53 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C10418"
			(at 0 353.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "6d90ea44-d70b-438f-a3a8-74653014288b")
		)
		(pin "2"
			(uuid "bb396931-e18d-4f08-9637-84242c0c50d8")
		)
		(pin "3"
			(uuid "bb93f051-1c0a-4da9-bef6-ecb7f8cdedd3")
		)
		(pin "4"
			(uuid "fd2d3efa-9c20-4616-af1f-078fd9354bb4")
		)
		(pin "5"
			(uuid "d2dade68-3398-406c-a385-2a342133fedc")
		)
		(pin "6"
			(uuid "92b2a0d7-fb92-48c1-af2a-bc1fe35e3fb8")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "J2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:VBUS-power")
		(at 236.22 168.91 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e2dd12d")
		(property "Reference" "#PWR027"
			(at 236.22 172.72 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "VBUS"
			(at 236.22 165.1 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 236.22 168.91 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 236.22 168.91 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 236.22 168.91 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "079adfa0-9ca6-4d08-8e77-637b8dcc6226")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR027")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 172.72 208.28 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e31c144")
		(property "Reference" "R6"
			(at 174.498 207.1116 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "309k"
			(at 174.498 209.423 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 170.942 208.28 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 172.72 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 172.72 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403149"
			(at 172.72 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3EKF3093V"
			(at 172.72 208.28 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "d75f4843-e269-4f33-893f-507b59219f43")
		)
		(pin "2"
			(uuid "c20cbde5-d881-455e-8119-0d785b0bb802")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R6")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 172.72 220.98 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e332167")
		(property "Reference" "R7"
			(at 174.498 219.8116 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "976k"
			(at 174.498 222.123 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 170.942 220.98 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 172.72 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 172.72 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403409"
			(at 172.72 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3EKF9763V"
			(at 172.72 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "af0ced44-8857-4684-89be-171d1c7f2daa")
		)
		(pin "2"
			(uuid "174e9550-1203-453f-a61b-86bb62754990")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R7")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 184.15 220.98 180)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e33472d")
		(property "Reference" "C12"
			(at 182.88 218.44 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "10n"
			(at 186.69 220.98 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 184.15 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 184.15 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 184.15 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C84709"
			(at 184.15 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10B103KC8NNNC"
			(at 184.15 220.98 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "a7ef5d2a-5ea8-4354-85a1-5f45904e91f9")
		)
		(pin "2"
			(uuid "22259035-f381-4663-9c4e-4d5a816846df")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C12")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 208.28 252.73 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e3aa886")
		(property "Reference" "#PWR025"
			(at 208.28 256.54 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 208.661 248.3358 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 208.28 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 208.28 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 208.28 252.73 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "bbc61980-d44f-446a-b366-034146923acb")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR025")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 394.97 101.6 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e423ca4")
		(property "Reference" "R12"
			(at 396.748 100.4316 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "4.7k"
			(at 396.748 102.743 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 393.192 101.6 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 394.97 101.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 394.97 101.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJP03F4701V"
			(at -1.27 196.85 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C427306"
			(at 394.97 101.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "b6e395f5-7f90-438a-969a-97a424f9e3c0")
		)
		(pin "2"
			(uuid "c4bce938-9675-46fa-9e02-dd88dee541bf")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R12")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:+3V3-power")
		(at 394.97 96.52 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e441597")
		(property "Reference" "#PWR055"
			(at 394.97 100.33 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "+3V3"
			(at 398.78 92.71 0)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 394.97 96.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 394.97 96.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 394.97 96.52 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "6e0ea6fe-bc2a-454e-9ea9-aeaf44eac60c")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR055")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:R")
		(at 20.32 273.05 0)
		(mirror y)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005e6a0c18")
		(property "Reference" "R1"
			(at 18.542 271.8816 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "309k"
			(at 18.542 274.193 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Resistor_SMD:R_0603_1608Metric"
			(at 22.098 273.05 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 20.32 273.05 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 20.32 273.05 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C403149"
			(at 20.32 273.05 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "ERJ3EKF3093V"
			(at 20.32 273.05 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "06acc23e-c5de-41fc-93df-5c031891a523")
		)
		(pin "2"
			(uuid "59085727-342a-4e30-8771-cee56accf868")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "R1")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 83.82 60.96 0)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005f27d22f")
		(property "Reference" "#PWR0104"
			(at 83.82 67.31 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 83.947 64.2112 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify right)
			)
		)
		(property "Footprint" ""
			(at 83.82 60.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 83.82 60.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 83.82 60.96 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "a1523170-a423-40f0-80a3-77f9851a00f0")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0104")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 306.07 62.23 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005f7de672")
		(property "Reference" "#PWR0105"
			(at 312.42 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 311.15 62.23 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 306.07 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 306.07 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 306.07 62.23 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "afaa8434-ef75-4707-bb8b-94267600882d")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0105")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 293.37 74.93 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005f93bf0e")
		(property "Reference" "C26"
			(at 290.83 77.47 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "10p"
			(at 295.91 77.47 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 293.37 74.93 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 293.37 74.93 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 293.37 74.93 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1634"
			(at 293.37 74.93 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10C100JB8NNNC"
			(at 293.37 74.93 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "2a17c72d-85d0-4dc6-96f0-1afc07a6dd12")
		)
		(pin "2"
			(uuid "b0436d7c-69da-4e33-b0a5-517d13edcd7b")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C26")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:C_Small")
		(at 293.37 69.85 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005f93bf16")
		(property "Reference" "C25"
			(at 295.91 68.58 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Value" "10p"
			(at 289.56 68.58 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" "Capacitor_SMD:C_0603_1608Metric"
			(at 293.37 69.85 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 293.37 69.85 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 293.37 69.85 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C1634"
			(at 293.37 69.85 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "CL10C100JB8NNNC"
			(at 293.37 69.85 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "5077a765-c04f-4cd1-9c8a-0121628ecc11")
		)
		(pin "2"
			(uuid "6e7873dd-1948-4063-886a-0d43b6d3d833")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "C25")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "Device:Crystal")
		(at 299.72 72.39 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005f93bf1f")
		(property "Reference" "Y2"
			(at 303.53 72.39 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Value" "32kHz"
			(at 307.34 72.39 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" "Crystal:Crystal_SMD_MicroCrystal_CC7V-T1A-2Pin_3.2x1.5mm"
			(at 299.72 72.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 299.72 72.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 299.72 72.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "MPN" "SC-32S32.768kHz20PPM7pF"
			(at 227.33 -228.6 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "LCSC" "C97604"
			(at 299.72 72.39 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "7bfd485b-1388-4df4-95b2-7f49d539e31a")
		)
		(pin "2"
			(uuid "8ccc3dbc-6923-48ce-a793-b141e9a25ba6")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "Y2")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:GND-power")
		(at 288.29 72.39 270)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005f93bf26")
		(property "Reference" "#PWR0106"
			(at 281.94 72.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "GND"
			(at 283.21 72.39 90)
			(effects
				(font
					(size 1.27 1.27)
				)
			)
		)
		(property "Footprint" ""
			(at 288.29 72.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" ""
			(at 288.29 72.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 288.29 72.39 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "c3624790-3069-42ec-a9c0-9f542fa2cd5e")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#PWR0106")
					(unit 1)
				)
			)
		)
	)
	(symbol
		(lib_id "oibus-mini-CCC-rescue:PWR_FLAG-power")
		(at 26.67 226.06 90)
		(unit 1)
		(exclude_from_sim no)
		(in_bom yes)
		(on_board yes)
		(dnp no)
		(uuid "00000000-0000-0000-0000-00005fb7d130")
		(property "Reference" "#FLG0101"
			(at 24.765 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Value" "PWR_FLAG"
			(at 23.4188 226.06 90)
			(effects
				(font
					(size 1.27 1.27)
				)
				(justify left)
			)
		)
		(property "Footprint" ""
			(at 26.67 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Datasheet" "~"
			(at 26.67 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(property "Description" ""
			(at 26.67 226.06 0)
			(effects
				(font
					(size 1.27 1.27)
				)
				(hide yes)
			)
		)
		(pin "1"
			(uuid "cd58d801-cf27-4871-91e7-6332c2d2dfeb")
		)
		(instances
			(project "oibus-mini-CCC"
				(path "/1407b3dd-f1be-4e4e-95b4-b6047e7bc5d1"
					(reference "#FLG0101")
					(unit 1)
				)
			)
		)
	)
	(sheet_instances
		(path "/"
			(page "1")
		)
	)
)