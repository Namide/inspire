<?php

namespace Directus\Customs\Hooks;

use Directus\Hook\HookInterface;
use Directus\Hook\Payload;

// use League\ColorExtractor\Color;
use League\ColorExtractor\ColorExtractor;
use League\ColorExtractor\Palette;

// https://github.com/thephpleague/color-extractor
class BeforeInsertDirectusFiles implements HookInterface
{
    /**
     * @param Payload $payload
     *
     * @return Payload
     */
    public function handle($payload = null)
    {
        // set the product sku before insert
        // $payload->set('sku', 'value');

        // print_r($payload->getData());
        // print_r($payload->toArray());

        $palette = Palette::fromFilename(BASE_PATH . '/storage/uploads/' . $payload->get('name'));
        $extractor = new ColorExtractor($palette);
        $colorsUint = ($extractor->extract(5));
        $colorsHex = array_map('dechex', $colorsUint);
        $colors = implode(',', $colorsHex);

        $payload->set('colors', $colors);

        return $payload;
    }
}
