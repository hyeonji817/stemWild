// Each character has its own anatomy, pose, face and silhouette.
// Only canvas size and the soft ground shadow belong to the shared brand system.
import { mkdirSync, writeFileSync } from 'node:fs';

const drawings = {
lemur: `
<defs><mask id="ringtail" maskUnits="userSpaceOnUse" x="0" y="0" width="300" height="300"><path d="M180 231C237 255 272 210 256 155Q249 133 248 118" fill="none" stroke="#f4f1e9" stroke-width="24" stroke-linecap="round"/></mask></defs>
<path d="M180 231C237 255 272 210 256 155Q249 133 248 118" fill="none" stroke="#f4f1e9" stroke-width="24" stroke-linecap="round"/>
<g mask="url(#ringtail)" stroke="#625e6b" stroke-width="13" stroke-linecap="round"><path d="M195 230q1 10-2 23m22-26 7 22m11-36 16 16m-4-35 21 8m-17-29 22 1m-24-24 24-7m-28-13 22-11"/></g>
<ellipse cx="145" cy="215" rx="40" ry="44" fill="#a6a2b3"/><ellipse cx="145" cy="217" rx="25" ry="34" fill="#f8f6ec"/>
<path d="M116 199Q86 184 81 155M174 199Q197 184 202 157" stroke="#a6a2b3" stroke-width="17" stroke-linecap="round" fill="none"/>
<ellipse cx="79" cy="151" rx="10" ry="15" transform="rotate(-14 79 151)" fill="#777080"/><ellipse cx="204" cy="153" rx="10" ry="15" transform="rotate(14 204 153)" fill="#777080"/>
<ellipse cx="119" cy="252" rx="23" ry="11" fill="#777080"/><ellipse cx="171" cy="252" rx="23" ry="11" fill="#777080"/>
<circle cx="97" cy="98" r="22" fill="#777080"/><circle cx="193" cy="98" r="22" fill="#777080"/><circle cx="97" cy="98" r="12" fill="#cdc0c2"/><circle cx="193" cy="98" r="12" fill="#cdc0c2"/>
<ellipse cx="145" cy="135" rx="61" ry="51" fill="#faf8ef"/>
<ellipse cx="116" cy="132" rx="18" ry="24" transform="rotate(14 116 132)" fill="#625e6b"/><ellipse cx="174" cy="132" rx="18" ry="24" transform="rotate(-14 174 132)" fill="#625e6b"/>
<circle cx="117" cy="132" r="8" fill="#c5b26d"/><circle cx="173" cy="132" r="8" fill="#c5b26d"/><circle cx="118" cy="133" r="4.5" fill="#30352f"/><circle cx="172" cy="133" r="4.5" fill="#30352f"/><circle cx="119" cy="130" r="1.8" fill="#fffdf4"/><circle cx="173" cy="130" r="1.8" fill="#fffdf4"/>
<ellipse cx="145" cy="157" rx="8" ry="5" fill="#524e59"/><path d="M145 162v5m-7 1q7 6 14 0" stroke="#524e59" stroke-width="2.6" stroke-linecap="round" fill="none"/>
<path d="M122 184Q144 195 168 184Q171 194 145 199Q121 195 122 184" fill="#b4ca83"/>`,
squirrel: `
<path d="M193 210C269 217 275 130 239 135C214 138 239 169 204 174" fill="none" stroke="#9b7e68" stroke-width="30" stroke-linecap="round"/>
<path d="M89 114Q43 113 40 139Q57 172 60 225L112 211Q150 254 189 212L238 226Q228 174 259 139Q239 112 210 116L185 142 113 144Z" fill="#b69c7c"/>
<path d="M62 143L96 158 116 205 75 215Q77 176 62 143M238 143L203 158 186 205 222 216Q218 175 238 143" fill="#e6cdb0"/>
<ellipse cx="151" cy="178" rx="49" ry="55" fill="#bb9f7d"/><ellipse cx="151" cy="184" rx="32" ry="43" fill="#fff3df"/>
<path d="M106 94Q88 63 109 61Q131 57 132 90M172 90Q176 56 196 62Q214 69 195 96" fill="#9b7e68"/>
<path d="M109 91Q99 72 111 71M184 89q13-19 12-13" stroke="#e8beb1" stroke-width="9" stroke-linecap="round"/>
<path d="M93 116Q97 80 150 83Q201 81 209 118Q212 159 151 165Q92 160 93 116" fill="#b69c7c"/>
<path d="M99 123Q123 110 149 137Q177 110 203 123Q196 157 151 159Q108 157 99 123" fill="#fff3df"/>
<circle cx="118" cy="122" r="12" fill="#332e2a"/><circle cx="185" cy="122" r="12" fill="#332e2a"/><circle cx="121" cy="118" r="4" fill="white"/><circle cx="188" cy="118" r="4" fill="white"/>
<path d="M143 141q8-8 16 0l-8 6z" fill="#69523f"/><path d="M145 151q6 6 13-1" stroke="#69523f" stroke-width="2.5" fill="none"/>
<ellipse cx="45" cy="137" rx="14" ry="10" fill="#79614e" transform="rotate(25 45 137)"/><ellipse cx="255" cy="137" rx="14" ry="10" fill="#79614e" transform="rotate(-25 255 137)"/>
<ellipse cx="106" cy="220" rx="16" ry="10" fill="#79614e"/><ellipse cx="196" cy="220" rx="16" ry="10" fill="#79614e"/>
<path d="M146 172q16-21 25-6-6 14-25 6" fill="#9fb963"/>`,
quokka: `
<path d="M184 234Q222 256 250 243" stroke="#9e7d58" stroke-width="9" stroke-linecap="round" fill="none"/>
<ellipse cx="148" cy="212" rx="57" ry="44" fill="#b9966d"/><ellipse cx="148" cy="216" rx="37" ry="35" fill="#e1c7a3"/>
<ellipse cx="109" cy="251" rx="26" ry="12" fill="#9e7d58"/><ellipse cx="184" cy="251" rx="27" ry="12" fill="#9e7d58"/>
<ellipse cx="100" cy="92" rx="22" ry="27" transform="rotate(-20 100 92)" fill="#aa8963"/><ellipse cx="183" cy="84" rx="21" ry="27" transform="rotate(12 183 84)" fill="#aa8963"/>
<ellipse cx="100" cy="92" rx="11" ry="16" fill="#d7baa0"/><ellipse cx="183" cy="84" rx="10" ry="16" fill="#d7baa0"/>
<path d="M84 133C82 100 107 85 143 87C177 85 196 102 201 125C215 145 198 169 174 174Q137 185 106 170Q84 159 84 133" fill="#b9966d"/>
<ellipse cx="145" cy="151" rx="47" ry="27" fill="#e1c7a3"/>
<path d="M108 127q7-8 14 0m43-2q7-9 14 0" stroke="#544636" stroke-width="4" stroke-linecap="round" fill="none"/>
<ellipse cx="147" cy="142" rx="11" ry="7" fill="#65503d"/>
<path d="M124 157Q147 176 174 155" stroke="#65503d" stroke-width="4" stroke-linecap="round" fill="none"/>
<path d="M112 193Q120 210 137 207M184 191Q176 209 160 207" stroke="#aa845d" stroke-width="15" stroke-linecap="round" fill="none"/>
<path d="M147 221Q136 205 144 190Q150 182 156 190Q169 208 147 221" fill="#99ae6b"/><path d="M148 217l3-20" stroke="#d8e4b4" stroke-width="2.2" stroke-linecap="round"/>`,
panda: `
<defs><clipPath id="panda-tail"><path d="M176 229C219 259 277 229 256 187C247 167 224 172 230 191C240 215 210 226 190 212Z"/></clipPath><radialGradient id="panda-coat" cx=".4" cy=".25" r=".85"><stop stop-color="#df9a5c"/><stop offset="1" stop-color="#b96440"/></radialGradient></defs>
<path d="M176 229C219 259 277 229 256 187C247 167 224 172 230 191C240 215 210 226 190 212Z" fill="#df9e65"/>
<g clip-path="url(#panda-tail)" stroke="#b56543" stroke-width="14"><path d="M195 219l7 31m15-32 17 25m-1-42 29 11m-32-32 28-7"/></g>
<ellipse cx="147" cy="216" rx="51" ry="46" fill="#423937"/><ellipse cx="148" cy="210" rx="31" ry="30" fill="#51423c"/>
<ellipse cx="117" cy="250" rx="24" ry="14" fill="#372f2f"/><ellipse cx="177" cy="250" rx="24" ry="14" fill="#372f2f"/>
<path d="M106 191Q85 210 73 184" fill="none" stroke="#423937" stroke-width="20" stroke-linecap="round"/><ellipse cx="70" cy="176" rx="14" ry="17" transform="rotate(-16 70 176)" fill="#423937"/><ellipse cx="70" cy="178" rx="7" ry="8" fill="#b88b82"/>
<path d="M185 191q19 14 4 34" fill="none" stroke="#423937" stroke-width="21" stroke-linecap="round"/>
<path d="M90 114Q65 101 69 72Q71 55 87 58Q118 62 123 98M175 98Q181 64 209 58Q225 55 228 73Q231 102 206 115" fill="#fff3df"/>
<path d="M85 96Q77 81 81 71Q96 73 106 94M192 94Q203 74 216 71Q221 86 209 99" fill="#b48c79"/>
<path d="M77 127C76 94 107 76 147 76C188 75 220 95 221 128Q225 140 232 144Q227 153 218 155Q225 163 219 170Q205 168 200 174Q178 194 147 193Q116 194 93 174Q86 168 75 171Q68 165 76 156Q64 153 65 146Q76 139 77 127Z" fill="url(#panda-coat)"/>
<path d="M79 137Q89 121 105 125Q118 131 119 147Q125 160 141 157L155 157Q172 158 177 146Q178 131 191 125Q207 121 218 138Q219 155 204 171Q178 190 147 189Q113 189 89 170Q74 157 79 137" fill="#fff3df"/>
<path d="M106 139Q110 130 120 132Q131 147 122 161Q111 165 106 158Q113 149 106 139M172 133Q182 130 189 140Q181 149 188 158Q183 167 172 160Q165 146 172 133" fill="#995339"/>
<ellipse cx="116" cy="117" rx="8" ry="13" transform="rotate(22 116 117)" fill="#fff3df"/><ellipse cx="180" cy="117" rx="8" ry="13" transform="rotate(-22 180 117)" fill="#fff3df"/>
<ellipse cx="116" cy="141" rx="7.5" ry="9" fill="#49332b"/><ellipse cx="180" cy="141" rx="7.5" ry="9" fill="#49332b"/>
<ellipse cx="117" cy="143" rx="4.5" ry="5" fill="#80523b"/><ellipse cx="181" cy="143" rx="4.5" ry="5" fill="#80523b"/><circle cx="118" cy="138" r="3" fill="#fffdf5"/><circle cx="182" cy="138" r="3" fill="#fffdf5"/>
<ellipse cx="147" cy="163" rx="24" ry="18" fill="#fff9ee"/>
<path d="M138 154Q147 148 156 154Q158 160 147 164Q136 160 138 154" fill="#453735"/>
<path d="M147 164v5m-8 0q8 9 16 0" fill="none" stroke="#654b41" stroke-width="2.5" stroke-linecap="round"/>
<ellipse cx="98" cy="159" rx="9" ry="5" fill="#edc2ae"/><ellipse cx="199" cy="159" rx="9" ry="5" fill="#edc2ae"/>
<path d="M84 151l-17-2m19 9-18 5m142-11 17-3m-19 10 18 5" fill="none" stroke="#d5baa2" stroke-width="1.5" stroke-linecap="round"/>`,
bear: `
<ellipse cx="150" cy="208" rx="72" ry="51" fill="#414d43"/>
<ellipse cx="98" cy="210" rx="22" ry="36" transform="rotate(16 98 210)" fill="#374239"/><ellipse cx="202" cy="210" rx="22" ry="36" transform="rotate(-16 202 210)" fill="#374239"/>
<ellipse cx="104" cy="248" rx="27" ry="22" fill="#303c33"/><ellipse cx="196" cy="248" rx="27" ry="22" fill="#303c33"/>
<ellipse cx="104" cy="250" rx="14" ry="12" fill="#697669"/><ellipse cx="196" cy="250" rx="14" ry="12" fill="#697669"/>
<circle cx="96" cy="94" r="23" fill="#374239"/><circle cx="204" cy="94" r="23" fill="#374239"/><circle cx="96" cy="94" r="12" fill="#a5a18b"/><circle cx="204" cy="94" r="12" fill="#a5a18b"/>
<ellipse cx="150" cy="133" rx="72" ry="52" fill="#414d43"/>
<ellipse cx="120" cy="129" rx="5" ry="6" fill="#25332a"/><ellipse cx="180" cy="129" rx="5" ry="6" fill="#25332a"/>
<ellipse cx="150" cy="151" rx="30" ry="23" fill="#bab398"/><ellipse cx="150" cy="142" rx="12" ry="8" fill="#303c33"/>
<path d="M150 150v9m-8 0q8 7 16 0" stroke="#303c33" stroke-width="2.8" stroke-linecap="round" fill="none"/>
<path d="M119 188Q149 209 181 188Q176 211 151 219Q127 211 119 188" fill="#f1e6c7"/>`,
rabbit: `
<defs><radialGradient id="bunny-coat" cx=".35" cy=".2" r=".9"><stop stop-color="#f6e7d1"/><stop offset="1" stop-color="#dac1a0"/></radialGradient></defs>
<circle cx="91" cy="219" r="21" fill="#fffaf0"/>
<ellipse cx="146" cy="218" rx="51" ry="42" fill="url(#bunny-coat)"/>
<ellipse cx="146" cy="222" rx="33" ry="29" fill="#fff9ee"/>
<ellipse cx="115" cy="251" rx="24" ry="12" fill="#d7bb98"/><ellipse cx="178" cy="251" rx="24" ry="12" fill="#d7bb98"/>
<path d="M113 115Q87 83 92 48Q95 27 107 35Q126 48 131 108M161 110Q162 53 185 36Q198 29 199 50Q197 89 180 116" fill="url(#bunny-coat)"/>
<path d="M116 102Q99 68 103 49Q111 46 121 102M171 103Q174 63 189 49Q193 69 180 106" fill="#ecc4bf"/>
<path d="M83 142Q82 107 112 100Q142 92 177 100Q210 107 212 140Q217 177 172 188Q142 198 107 183Q78 174 83 142" fill="url(#bunny-coat)"/>
<ellipse cx="111" cy="156" rx="21" ry="20" fill="#fff9ee"/><ellipse cx="184" cy="156" rx="21" ry="20" fill="#fff9ee"/>
<ellipse cx="147" cy="168" rx="31" ry="20" fill="#fff9ee"/>
<ellipse cx="119" cy="139" rx="8.5" ry="10.5" fill="#635044"/><ellipse cx="177" cy="139" rx="8.5" ry="10.5" fill="#635044"/>
<ellipse cx="120" cy="142" rx="5" ry="6" fill="#94715b"/><ellipse cx="178" cy="142" rx="5" ry="6" fill="#94715b"/>
<circle cx="121" cy="135" r="3.2" fill="#fffef6"/><circle cx="179" cy="135" r="3.2" fill="#fffef6"/><circle cx="116" cy="142" r="1.5" fill="#fffef6"/><circle cx="174" cy="142" r="1.5" fill="#fffef6"/>
<path d="M111 126q8-4 15-1m43 0q8-3 16 1" stroke="#c2a383" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<ellipse cx="104" cy="157" rx="11" ry="6.5" fill="#e9b8b0"/><ellipse cx="192" cy="157" rx="11" ry="6.5" fill="#e9b8b0"/>
<path d="M140 155Q147 150 155 155Q156 160 148 163Q140 161 140 155" fill="#c98e94"/>
<path d="M148 163v5m-9 0q9 9 18 0" stroke="#9d7468" stroke-width="2.5" fill="none" stroke-linecap="round"/>
<path d="M144 173q4 3 8 0v6q-4 3-8 0z" fill="#e8a7a1"/>
<path d="M99 166l-15 2m113-2 15 2" stroke="#cab399" stroke-width="1.5" stroke-linecap="round"/>
<path d="M112 206q10 17 25 12m46-12q-9 17-26 12" stroke="#d7bb98" stroke-width="13" stroke-linecap="round" fill="none"/>
<path d="M139 223l-7-18q12-12 26-2l-8 21q-5 6-11-1" fill="#e9ae78"/>
<path d="M143 206q-17-13-8-18 10 0 10 17m0 0q0-22 9-20 8 8-7 22" fill="#a6ba7a"/>`,
wolf: `
<path d="M183 225Q217 215 232 233Q244 251 218 255Q192 260 176 244" fill="#94a4ae"/>
<path d="M223 227Q238 231 237 242Q234 253 219 254Q213 240 223 227" fill="#edf0e9"/>
<ellipse cx="148" cy="215" rx="48" ry="43" fill="#94a4ae"/>
<ellipse cx="148" cy="218" rx="29" ry="33" fill="#edf0e9"/>
<path d="M113 195Q96 210 108 233M183 195Q201 213 188 231" fill="none" stroke="#8496a3" stroke-width="19" stroke-linecap="round"/>
<ellipse cx="125" cy="248" rx="20" ry="14" fill="#8496a3"/><ellipse cx="173" cy="248" rx="20" ry="14" fill="#8496a3"/>
<path d="M93 111Q80 90 87 62Q90 48 101 57Q124 74 129 102M167 101Q177 72 197 57Q209 49 211 65Q216 93 201 113" fill="#94a4ae"/>
<path d="M99 96Q91 79 96 70Q108 77 115 97M181 97Q190 78 201 70Q205 87 196 101" fill="#d7bebd"/>
<path d="M78 132C78 102 107 84 148 84C190 84 219 104 219 135C219 169 188 191 148 192C108 193 78 170 78 132Z" fill="#a5b3bb"/>
<path d="M84 144Q90 127 107 129Q124 130 136 146Q148 156 161 145Q175 128 191 129Q209 129 213 146Q208 180 149 185Q92 184 84 144" fill="#edf0e9"/>
<path d="M109 119q9-6 18-2m43 0q9-4 18 2" fill="none" stroke="#8496a3" stroke-width="4" stroke-linecap="round"/>
<ellipse cx="118" cy="137" rx="6" ry="7.5" fill="#41545f"/><ellipse cx="179" cy="137" rx="6" ry="7.5" fill="#41545f"/>
<circle cx="120" cy="134" r="2.3" fill="white"/><circle cx="181" cy="134" r="2.3" fill="white"/>
<ellipse cx="102" cy="155" rx="11" ry="6" fill="#dfb5b0"/><ellipse cx="195" cy="155" rx="11" ry="6" fill="#dfb5b0"/>
<path d="M140 152Q148 147 157 152Q161 159 148 163Q137 158 140 152" fill="#41545f"/>
<path d="M148 163v6m-8 0q8 9 16 0" fill="none" stroke="#41545f" stroke-width="2.7" stroke-linecap="round"/>
<path d="M119 184Q148 196 178 184Q177 197 149 201Q125 199 119 184" fill="#b2ca85"/>
<path d="M166 195Q178 198 183 210Q171 212 160 200" fill="#c7e79d"/>`,
fox: `
<path d="M174 220C205 191 239 190 245 216C252 250 209 259 174 247Q156 235 174 220" fill="#d6b27a"/>
<path d="M230 205Q251 209 244 230Q238 246 215 249Q226 235 227 220Q228 210 230 205" fill="#fbf2db"/>
<ellipse cx="150" cy="218" rx="42" ry="39" fill="#ddc18f"/><ellipse cx="150" cy="221" rx="25" ry="31" fill="#fbf2db"/>
<ellipse cx="128" cy="248" rx="17" ry="12" fill="#c9a36d"/><ellipse cx="174" cy="248" rx="17" ry="12" fill="#c9a36d"/>
<path d="M123 208Q113 219 119 233M179 208Q188 218 182 232" fill="none" stroke="#c9a36d" stroke-width="13" stroke-linecap="round"/>
<path d="M105 128Q72 103 68 44Q67 27 79 33Q112 54 132 107M168 107Q190 53 222 32Q234 28 232 45Q229 103 197 130" fill="#ddc18f"/>
<path d="M105 105Q84 80 81 51Q100 63 119 105M182 104Q199 65 219 51Q215 84 196 109" fill="#d8b69d"/>
<path d="M89 140C86 112 113 99 150 100C186 99 214 114 212 141C211 165 177 182 150 188Q121 182 102 166Q89 156 89 140" fill="#ddc18f"/>
<path d="M95 146Q106 133 121 142Q139 160 151 157Q164 158 180 141Q197 133 207 147Q197 166 150 181Q108 167 95 146" fill="#fbf2db"/>
<ellipse cx="122" cy="138" rx="5" ry="7" fill="#5c503d"/><ellipse cx="180" cy="138" rx="5" ry="7" fill="#5c503d"/>
<ellipse cx="151" cy="157" rx="7" ry="4.5" fill="#5c503d"/><path d="M151 161v6m-6 1q6 5 12 0" stroke="#5c503d" stroke-width="2.4" stroke-linecap="round" fill="none"/>
<path d="M108 154l-19 2m21 4-18 7m101-13 19 2m-21 4 18 7" stroke="#bc9f77" stroke-width="1.6" stroke-linecap="round"/>
<circle cx="175" cy="204" r="5" fill="#a6ba7a"/>`,
porpoise: `
<path d="M69 188C61 139 92 98 152 91C209 81 246 115 245 155Q243 181 219 188Q204 187 194 178Q159 202 119 198L86 222Q66 220 68 209L82 194Z" fill="#8faab1"/>
<path d="M85 180Q129 196 192 161Q199 190 216 187Q179 226 118 212L88 230 74 219 91 202" fill="#dce9e8"/>
<path d="M76 185Q47 187 32 161Q30 184 44 198Q25 205 31 222Q62 221 87 202" fill="#8faab1"/>
<path d="M155 185Q150 216 127 220Q116 211 130 193" fill="#77969e"/>
<path d="M199 143q9-10 17-1" stroke="#354f59" stroke-width="4" fill="none" stroke-linecap="round"/>
<path d="M211 162q13 6 24-4" stroke="#354f59" stroke-width="3" fill="none" stroke-linecap="round"/>
<ellipse cx="202" cy="159" rx="10" ry="5" fill="#d7aaa3"/>
<path d="M172 106l9-2" stroke="#627e85" stroke-width="4" stroke-linecap="round"/>
<path d="M64 244q24-12 48 0m27 0q24-12 48 0m27-7 21-4" stroke="#b2cbd0" stroke-width="4" fill="none" stroke-linecap="round"/>
<circle cx="245" cy="90" r="9" stroke="#b2cbd0" stroke-width="3" fill="none"/><circle cx="263" cy="65" r="5" fill="#b2cbd0"/>`,
marten: `
<path d="M191 213Q236 211 245 169Q249 155 256 166C278 203 250 247 208 245Q190 238 191 213" fill="#665447"/>
<path d="M103 168C121 155 141 168 161 185Q189 204 214 205C236 216 213 241 190 236Q163 230 144 212Q125 201 109 198Q92 187 103 168" fill="#80634e"/>
<path d="M118 191Q112 215 107 236Q97 249 85 246Q78 240 92 234L101 190M177 215Q181 236 198 239Q207 249 193 250Q173 250 169 231" fill="#57463a"/>
<path d="M100 135Q126 138 140 162Q151 178 137 192Q122 199 106 184Q90 169 94 151Q94 141 100 135" fill="#e5b951"/>
<path d="M124 180Q142 181 148 201Q146 211 138 206Q128 195 121 190" fill="#edc766"/>
<circle cx="86" cy="102" r="18" fill="#6c5241"/><circle cx="141" cy="91" r="17" fill="#6c5241"/><circle cx="86" cy="102" r="9" fill="#bd9a7c"/><circle cx="141" cy="91" r="8" fill="#bd9a7c"/>
<path d="M79 121C77 102 94 91 116 94Q147 95 153 116Q158 127 173 130Q185 137 172 146Q164 151 153 150Q136 167 112 160Q88 155 81 137Q78 129 79 121" fill="#80634e"/>
<path d="M119 137Q138 122 155 132Q165 137 175 136Q181 141 169 147Q149 156 133 149Z" fill="#c7a97f"/>
<ellipse cx="114" cy="122" rx="5" ry="6" fill="#34392f"/><ellipse cx="146" cy="118" rx="4" ry="5" fill="#34392f"/>
<ellipse cx="173" cy="135" rx="6" ry="4.5" fill="#34392f"/><path d="M158 150q5 2 9-2" fill="none" stroke="#57463a" stroke-width="2" stroke-linecap="round"/>
<path d="M88 145l-15 1m16 5-14 4" stroke="#b79977" stroke-width="1.5" stroke-linecap="round"/>
<path d="M136 181Q149 184 155 197" stroke="#6c5241" stroke-width="11" stroke-linecap="round" fill="none"/>`
};

mkdirSync('public/animals', { recursive: true });
for (const [name, drawing] of Object.entries(drawings)) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none"><ellipse cx="150" cy="265" rx="87" ry="9" fill="#263c3010"/>${drawing}</svg>\n`;
  writeFileSync(`public/animals/${name}.svg`, svg);
}
console.log(`Redrew ${Object.keys(drawings).length} distinct characters.`);

