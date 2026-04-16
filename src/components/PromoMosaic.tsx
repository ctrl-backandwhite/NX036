import React, { memo } from 'react';
import { View, Text, TouchableOpacity, Image, Dimensions } from 'react-native';
import FA5 from 'react-native-vector-icons/FontAwesome5';

const { width: SCREEN_W } = Dimensions.get('window');
const GAP = 8;
const PAD = 16;
const MOSAIC_W = SCREEN_W - PAD * 2;

export interface Slide {
    id: string;
    title: string;
    subtitle: string | null;
    imageUrl: string;
    link: string | null;
    buttonText: string | null;
}

interface PromoMosaicProps {
    slides: Slide[];
    onSlidePress: (slide: Slide) => void;
}

/**
 * Modern bento-style promotional mosaic.
 *
 * Layout (6 slides):
 *  ┌──────────────┬──────┐
 *  │              │  B   │
 *  │     A (big)  ├──────┤
 *  │              │  C   │
 *  ├──────┬───────┴──────┤
 *  │  D   │     E (wide) │
 *  ├──────┴──────────────┤
 *  │     F (full-width)  │
 *  └─────────────────────┘
 */
function PromoMosaicInner({ slides, onSlidePress }: PromoMosaicProps) {
    if (slides.length === 0) return null;

    // Ensure we always have at least 6 tiles, cycling if needed
    const s = [...slides];
    while (s.length < 6) s.push(...slides);
    const tiles = s.slice(0, 6);

    const colLeft = (MOSAIC_W - GAP) * 0.6;
    const colRight = MOSAIC_W - colLeft - GAP;
    const row1H = 220;
    const halfRow1 = (row1H - GAP) / 2;
    const row2H = 140;
    const col2Left = (MOSAIC_W - GAP) * 0.4;
    const col2Right = MOSAIC_W - col2Left - GAP;
    const row3H = 120;

    return (
        <View style={{ paddingHorizontal: PAD, marginTop: 16 }}>
            {/* Row 1: Big left + two stacked right */}
            <View style={{ flexDirection: 'row', height: row1H }}>
                <MosaicTile
                    slide={tiles[0]}
                    width={colLeft}
                    height={row1H}
                    onPress={() => onSlidePress(tiles[0])}
                    titleSize={18}
                    subtitleSize={12}
                    badge="🔥 Destacado"
                />
                <View style={{ width: GAP }} />
                <View style={{ flex: 1 }}>
                    <MosaicTile
                        slide={tiles[1]}
                        width={colRight}
                        height={halfRow1}
                        onPress={() => onSlidePress(tiles[1])}
                        titleSize={13}
                        subtitleSize={10}
                    />
                    <View style={{ height: GAP }} />
                    <MosaicTile
                        slide={tiles[2]}
                        width={colRight}
                        height={halfRow1}
                        onPress={() => onSlidePress(tiles[2])}
                        titleSize={13}
                        subtitleSize={10}
                    />
                </View>
            </View>

            <View style={{ height: GAP }} />

            {/* Row 2: Small left + wide right */}
            <View style={{ flexDirection: 'row', height: row2H }}>
                <MosaicTile
                    slide={tiles[3]}
                    width={col2Left}
                    height={row2H}
                    onPress={() => onSlidePress(tiles[3])}
                    titleSize={13}
                    subtitleSize={10}
                />
                <View style={{ width: GAP }} />
                <MosaicTile
                    slide={tiles[4]}
                    width={col2Right}
                    height={row2H}
                    onPress={() => onSlidePress(tiles[4])}
                    titleSize={15}
                    subtitleSize={11}
                    badge="⚡ Oferta"
                />
            </View>

            <View style={{ height: GAP }} />

            {/* Row 3: Full-width banner */}
            <MosaicTile
                slide={tiles[5]}
                width={MOSAIC_W}
                height={row3H}
                onPress={() => onSlidePress(tiles[5])}
                titleSize={16}
                subtitleSize={12}
                badge="🎁 Promo Especial"
                fullWidth
            />
        </View>
    );
}

interface MosaicTileProps {
    slide: Slide;
    width: number;
    height: number;
    onPress: () => void;
    titleSize?: number;
    subtitleSize?: number;
    badge?: string;
    fullWidth?: boolean;
}

function MosaicTile({ slide, width, height, onPress, titleSize = 14, subtitleSize = 11, badge, fullWidth }: MosaicTileProps) {
    return (
        <TouchableOpacity
            onPress={onPress}
            activeOpacity={0.85}
            style={{
                width,
                height,
                borderRadius: 16,
                overflow: 'hidden',
                backgroundColor: '#e5e7eb',
            }}>
            <Image
                source={{ uri: slide.imageUrl }}
                style={{ position: 'absolute', width: '100%', height: '100%' }}
                resizeMode="cover"
            />
            {/* Gradient overlay using stacked opacity layers */}
            <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: height * 0.65 }}>
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.0)' }} />
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.15)' }} />
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} />
                <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.55)' }} />
            </View>
            {/* Badge */}
            {badge && (
                <View
                    style={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        backgroundColor: 'rgba(0,0,0,0.55)',
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 8,
                    }}>
                    <Text style={{ color: '#fff', fontSize: 10, fontWeight: '700' }}>{badge}</Text>
                </View>
            )}
            {/* Content */}
            <View
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: fullWidth ? 14 : 10,
                }}>
                <Text
                    style={{
                        color: '#fff',
                        fontSize: titleSize,
                        fontWeight: '800',
                        textShadowColor: 'rgba(0,0,0,0.6)',
                        textShadowOffset: { width: 0, height: 1 },
                        textShadowRadius: 3,
                    }}
                    numberOfLines={2}>
                    {slide.title}
                </Text>
                {slide.subtitle && height >= 110 && (
                    <Text
                        style={{
                            color: 'rgba(255,255,255,0.85)',
                            fontSize: subtitleSize,
                            marginTop: 2,
                            textShadowColor: 'rgba(0,0,0,0.5)',
                            textShadowOffset: { width: 0, height: 1 },
                            textShadowRadius: 2,
                        }}
                        numberOfLines={1}>
                        {slide.subtitle}
                    </Text>
                )}
                {slide.buttonText && height >= 140 && (
                    <View
                        style={{
                            alignSelf: 'flex-start',
                            marginTop: 6,
                            backgroundColor: '#fff',
                            paddingHorizontal: 12,
                            paddingVertical: 5,
                            borderRadius: 20,
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Text style={{ color: '#1f2937', fontSize: 11, fontWeight: '700' }}>
                            {slide.buttonText}
                        </Text>
                        <FA5 name="arrow-right" size={9} color="#1f2937" style={{ marginLeft: 4 }} />
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
}

export const PromoMosaic = memo(PromoMosaicInner);
