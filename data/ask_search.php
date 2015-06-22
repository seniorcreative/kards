<?php
/**
 * Created by PhpStorm.
 * User: steve.smith
 * Date: 22/06/15
 * Time: 10:04 AM
 */

class AskSearch {


    function __construct()
    {

        /// Default constructor.

    }

    public function getAutoCompleteAskSearch( )
    {
        $search_phrase = addslashes(trim($this->functions->Sanitize($_REQUEST['query'])));

        $sql = "SELECT

                    faq.id,
                    faq.question,
                    faq.answer,

                    #LEFT( SOUNDEX(:float), 1000000 ) as soundex

                    FROM tbl_general_reports_faqs faq
                    INNER JOIN tbl_general_report gr
                    on gr.general_report_id = faq.general_report_id

                        WHERE (
                                    MATCH( faq.question )

                                    AGAINST( :fulltext IN NATURAL LANGUAGE MODE )
                                )

                                #OR LEFT( SOUNDEX(:soundex), 1000000 )

                                #OR question LIKE :q

                                #OR answer LIKE :a

                        {$this->dateSentLiveCondition}

                        LIMIT 0, 10


                    ;";


        $query = $this->cmsDatabase->query($sql,

            array(
                'q'
                => '%' . $search_phrase . '%',
                'a'
                => '%' . $search_phrase . '%',
                'fulltext'
                => $search_phrase,
                'soundex'
                => $search_phrase,
                'float'
                => $search_phrase
            ),

            PDO::FETCH_ASSOC);
        // ALTERNATIVE SEARCH
        if( empty($query) )
        {
            $regexSafeSearch = ( !empty($this->getSafeWords( $search_phrase )) ) ? " OR question REGEXP '".$this->getSafeWords( $search_phrase )."'" : '' ;
            $query = $this->cmsDatabase->query("SELECT

                                                        faq.id,
                                                        faq.question
                                                        FROM tbl_general_reports_faqs faq
                                                        INNER JOIN tbl_general_report gr
                                                                                                            on gr.general_report_id = faq.general_report_id
                                                        WHERE (
                                                        faq.question LIKE :q

                                                                                                                        ".$regexSafeSearch."

                                                          )
                                                                                                                {$this->dateSentLiveCondition}

                                                        ORDER BY faq.question
                                                        LIMIT 0, 10
                                                        ;",

                array(
                    'q'
                    => '%' . $search_phrase . '%'

                ),

                PDO::FETCH_ASSOC );
        }

        $query = $this->rankSearchResults($query);

        return $query;
    }


    private function rankSearchResults( array $results )
    {
        $reorder = array();

        $ResetOrder = array();

        foreach($results as $ord => $mord )
        {
            $percentage = '';

            $similarText = similar_text( preg_replace('!\s+!', '', trim($_REQUEST['query'])), trim($mord['question']), $percentage ) ;

            $reorder[$percentage] = array( 'phrase' => $mord, 'rank' => $percentage );
        }

        usort($reorder, function($a, $b) {
            return $a['rank'] < $b['rank'];
        });

        print_r($reorder);

        foreach( $reorder as $order )
        {
            $ResetOrder[] = $order['phrase'];
        }

        return $ResetOrder;
    }


    private function getSafeWords( $search_phrase )
    {
        $stopWords = explode('|', "a's|able|about|above|according|accordingly|across|actually|after|afterwards|again|against|ain't|all|allow|allows|almost|alone|along|already|also|although|always|am|among|amongst|an|and|another|any|anybody|anyhow|anyone|anything|anyway|anyways|anywhere|apart|appear|appreciate|appropriate|are|aren't|around|as|aside|ask|asking|associated|at|available|away|awfully|be|became|because|become|becomes|becoming|been|before|beforehand|behind|being|believe|below|beside|besides|best|better|between|beyond|both|brief|but|by|c'mon|c's|came|can|can't|cannot|cant|cause|causes|certain|certainly|changes|clearly|co|com|come|comes|concerning|consequently|consider|considering|contain|containing|contains|corresponding|could|couldn't|course|currently|definitely|described|despite|did|didn't|different|do|does|doesn't|doing|don't|done|down|downwards|during|each|edu|eg|eight|either|else|elsewhere|enough|entirely|especially|et|etc|even|ever|every|everybody|everyone|everything|everywhere|ex|exactly|example|except|far|few|fifth|first|five|followed|following|follows|for|former|formerly|forth|four|from|further|furthermore|get|gets|getting|given|gives|go|goes|going|gone|got|gotten|greetings|had|hadn't|happens|hardly|has|hasn't|have|haven't|having|he|he's|hello|help|hence|her|here|here's|hereafter|hereby|herein|hereupon|hers|herself|hi|him|himself|his|hither|hopefully|how|howbeit|however|i'd|i'll|i'm|i've|ie|if|ignored|immediate|in|inasmuch|inc|indeed|indicate|indicated|indicates|inner|insofar|instead|into|inward|is|isn't|it|it'd|it'll|it's|its|itself|just|keep|keeps|kept|know|known|knows|last|lately|later|latter|latterly|least|less|lest|let|let's|like|liked|likely|little|look|looking|looks|ltd|mainly|many|may|maybe|me|mean|meanwhile|merely|might|more|moreover|most|mostly|much|must|my|myself|name|namely|nd|near|nearly|necessary|need|needs|neither|never|nevertheless|new|next|nine|no|nobody|non|none|noone|nor|normally|not|nothing|novel|now|nowhere|obviously|of|off|often|oh|ok|okay|old|on|once|one|ones|only|onto|or|other|others|otherwise|ought|our|ours|ourselves|out|outside|over|overall|own|particular|particularly|per|perhaps|placed|please|plus|possible|presumably|probably|provides|que|quite|qv|rather|rd|re|really|reasonably|regarding|regardless|regards|relatively|respectively|right|said|same|saw|say|saying|says|second|secondly|see|seeing|seem|seemed|seeming|seems|seen|self|selves|sensible|sent|serious|seriously|seven|several|shall|she|should|shouldn't|since|six|so|some|somebody|somehow|someone|something|sometime|sometimes|somewhat|somewhere|soon|sorry|specified|specify|specifying|still|sub|such|sup|sure|t's|take|taken|tell|tends|th|than|thank|thanks|thanx|that|that's|thats|the|their|theirs|them|themselves|then|thence|there|there's|thereafter|thereby|therefore|therein|theres|thereupon|these|they|they'd|they'll|they're|they've|think|third|this|thorough|thoroughly|those|though|three|through|throughout|thru|thus|to|together|too|took|toward|towards|tried|tries|truly|try|trying|twice|two|un|under|unfortunately|unless|unlikely|until|unto|up|upon|us|use|used|useful|uses|using|usually|value|various|very|via|viz|vs|want|wants|was|wasn't|way|we|we'd|we'll|we're|we've|welcome|well|went|were|weren't|what|what's|whatever|when|whence|whenever|where|where's|whereafter|whereas|whereby|wherein|whereupon|wherever|whether|which|while|whither|who|who's|whoever|whole|whom|whose|why|will|willing|wish|with|within|without|won't|wonder|would|wouldn't|yes|yet|you|you'd|you'll|you're|you've|your|yours|yourself|yourselves|zero");

        $searchSafe = '';

        $phraseWords = array_filter( explode('|', preg_replace('/\s/', '|', $search_phrase) ) );

        foreach($phraseWords as $i => $word)
        {
            if( !in_array($word, $stopWords) )
            {
                $delimiter = ( $i+1 == sizeof($phraseWords) ) ? '' : '|';
                $searchSafe .= $word.$delimiter;
            }
        }

        if( substr($searchSafe, -1) == '|')
        {
            return substr($searchSafe, 0, -1);
        }

        return $searchSafe;

    }

} 